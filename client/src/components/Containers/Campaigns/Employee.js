import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/userContext';
import Router from 'next/router';
import { useMutation } from 'react-apollo';

import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  Container,
  CardTitle,
  CardText,
  Row,
  Col,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  Modal,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Input,
} from 'reactstrap';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';
import { makeStyles, Typography, Paper } from '@material-ui/core';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
  Skeleton,
} from '@material-ui/lab';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import SyncIcon from '@material-ui/icons/Sync';
import LockIcon from '@material-ui/icons/Lock';

const { API_URL } = process.env;

import { REQUEST_UPDATE_CAMPAIGN_BY_EMPLOYEE } from '../../../graphql/mutations/campaign/updateCampaign';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
    backgroundColor: '#1f2251',
  },
  success: {
    backgroundColor: '#009688',
  },
  processing: {
    backgroundColor: '#2196f3',
  },
  error: {
    backgroundColor: '#f44336',
  },
  inactive: {
    backgroundColor: '#bdbdbd',
  },
}));

const Employee = ({ campaign, cid }) => {
  const { enqueueSnackbar } = useSnackbar();
  console.log(campaign);
  const classes = useStyles();

  const { state } = useAuth();

  const [navState, setNav] = useState({
    vertical: 1,
  });

  const [note, setNote] = useState({
    note: null,
  });

  const [approveModal, setApproveModal] = useState(false);
  const toggleApproveModal = () => {
    setApproveModal(!approveModal);
  };

  const [unApproveModal, setUnApproveModal] = useState(false);
  const toggleUnApproveModal = () => {
    setUnApproveModal(!unApproveModal);
  };

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
  };

  const handleNoteChange = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setNote((previousState) => {
      return { ...previousState, note: value };
    });
  };

  const [requestUpdateCampaignMutation] = useMutation(
    REQUEST_UPDATE_CAMPAIGN_BY_EMPLOYEE,
    {
      update(cache, { data: { updateCampaign } }) {
        cache.modify({
          id: cache.identify(cid),
          fields: {
            campaign() {
              const newCampaignRef = cache.writeFragment({
                data: updateCampaign.campaign,
                fragment: UPDATE_CAMPAIGN_FRAGMENT,
              });
              return newCampaignRef;
            },
          },
        });
      },
    }
  );

  //employee approve/unapprove campaign
  const handleEmployeeApproval = async (status) => {
    await requestUpdateCampaignMutation({
      variables: {
        id: cid,
        approve: status,
        notee: note.note,
      },
    });
    if (status) {
      enqueueSnackbar('Approved campaign!', { variant: 'success' });
    } else enqueueSnackbar('Rejected the campaign!', { variant: 'warning' });
    //Router.push('/dashboard');
  };

  const handleEmployeeMaskPaid = async () => {
    try {
      await requestUpdateCampaignMutation({
        variables: {
          id: cid,
          complete: true,
        },
      });
      enqueueSnackbar('Mask as Paid Successfully!', { variant: 'success' });
    } catch (e) {
      console.log(e);
      enqueueSnackbar('Error during Mask as Paid!', {
        variant: 'error',
      });
    }
  };

  const renderApproveModal = () => {
    return (
      <Modal isOpen={approveModal} toggle={toggleApproveModal}>
        <div className='modal-header'>
          <h4 className='modal-title' id='avatarModal'>
            <strong>Approve campaign</strong>
          </h4>
          <button
            type='button'
            className='close'
            data-dismiss='modal'
            aria-hidden='true'
            onClick={() => {
              setNote({ note: null });
              toggleApproveModal();
            }}
          >
            <i className='tim-icons icon-simple-remove' />
          </button>
        </div>
        <ModalBody>
          <FormGroup className='modal-items'>
            <Label>
              Do you really want to approve this Campaign? Leave a comment:
            </Label>
            <Input
              type='textarea'
              id='content'
              placeholder='comment...'
              name='content'
              onChange={handleNoteChange}
              value={note.note != null ? note.note : ''}
              required
              className='modal-items'
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color='secondary'
            onClick={() => {
              setNote({ note: null });
              toggleApproveModal();
            }}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            disabled={note.note == null ? true : false}
            onClick={() => {
              try {
                handleEmployeeApproval(true);
              } catch (error) {
                enqueueSnackbar('An error has occurred, please try again!', {
                  variant: 'error',
                });
              }
              toggleApproveModal();
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const renderUnApproveModal = () => {
    return (
      <Modal isOpen={unApproveModal} toggle={toggleUnApproveModal}>
        <div className='modal-header'>
          <h4 className='modal-title' id='avatarModal'>
            <strong>Reject Campaign</strong>
          </h4>
          <button
            type='button'
            className='close'
            data-dismiss='modal'
            aria-hidden='true'
            onClick={() => {
              setNote({ note: null });
              toggleUnApproveModal();
            }}
          >
            <i className='tim-icons icon-simple-remove' />
          </button>
        </div>
        <ModalBody>
          <FormGroup className='modal-items'>
            <Label>
              Do you really want to reject this Campaign? Leave a comment:
            </Label>
            <Input
              type='textarea'
              id='content'
              placeholder='comment...'
              name='content'
              onChange={handleNoteChange}
              value={note.note != null ? note.note : ''}
              required
              className='modal-items'
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color='secondary'
            onClick={() => {
              setNote({ note: null });
              toggleApproveModal();
            }}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            disabled={note.note == null ? true : false}
            onClick={() => {
              try {
                handleEmployeeApproval(false);
              } catch (error) {
                enqueueSnackbar('An error has occurred, please try again!', {
                  variant: 'error',
                });
              }
              toggleUnApproveModal();
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const renderImage = () => {
    if (campaign.picture[0] !== undefined) {
      if (campaign.picture[0].formats.medium !== undefined) {
        return API_URL + campaign.picture[0].formats.medium.url;
      } else if (campaign.picture[0].formats.thumbnail !== undefined) {
        return API_URL + campaign.picture[0].formats.thumbnail.url;
      } else return '/256x186.svg';
    } else return '/256x186.svg';
  };

  const renderUserImage = () => {
    if (campaign.user.avatar !== undefined) {
      if (campaign.user.avatar !== undefined) {
        return API_URL + campaign.user.avatar.formats.thumbnail.url;
      } else return '/256x186.svg';
    } else return '/256x186.svg';
  };

  const renderInfluencerImage = () => {
    if (
      campaign.channels[0].user.avatar !== undefined ||
      campaign.channels[0].user.avatar !== null
    ) {
      if (
        campaign.channels[0].user.avatar.formats !== undefined ||
        campaign.channels[0].user.avatar.formats !== null
      ) {
        return API_URL + campaign.channels[0].user.avatar.formats.thumbnail.url;
      } else return '/256x186.svg';
    } else return '/256x186.svg';
  };

  const renderStatus = (approvalStatus, influencerStatus, status) => {
    if (approvalStatus == null) {
      return 'Waiting for licensing';
    }
    if (!approvalStatus) {
      return 'Not licensed';
    }
    if (approvalStatus && influencerStatus == null) {
      return 'Licensed - Waiting for Influencer approve';
    }
    if (approvalStatus && !influencerStatus) {
      return 'Licensed - Influencer rejected';
    }
    if (approvalStatus && influencerStatus && status == false) {
      return 'Licensed - Influencer approved - Active';
    } else return 'Licensed - Influencer approved - Ended';
  };

  return (
    <Row>
      {renderApproveModal()} {renderUnApproveModal()}
      <Col md='2'>
        <Nav className='nav-pills-primary flex-column' pills>
          <NavItem>
            <NavLink
              className={classnames({
                active: navState.vertical === 1,
              })}
              onClick={(e) => toggleTabs(e, 'vertical', 1)}
            >
              Campaign details
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: navState.vertical === 2,
              })}
              onClick={(e) => toggleTabs(e, 'vertical', 2)}
            >
              Stakeholders info
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: navState.vertical === 3,
              })}
              onClick={(e) => toggleTabs(e, 'vertical', 3)}
            >
              Campaign tracking
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <Col>
        <TabContent activeTab={'vertical' + navState.vertical}>
          <TabPane tabId='vertical1'>
            <Row>
              <Container>
                <Card className='single-card'>
                  <CardImg
                    src={renderImage()}
                    alt='Card image cap'
                    className='campaign-detail-img'
                  />
                  <CardBody>
                    <CardTitle>{campaign.title}</CardTitle>
                    <CardText
                      dangerouslySetInnerHTML={{
                        __html: campaign.content,
                      }}
                    ></CardText>
                    <CardSubtitle>
                      <strong>Category:</strong>
                    </CardSubtitle>
                    {campaign.category !== undefined ? (
                      <CardText>
                        {campaign.category.name} -{' '}
                        {campaign.category.description}
                      </CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Channel:</strong>
                    </CardSubtitle>
                    {campaign.channels[0] !== undefined ? (
                      <>
                        <CardText>
                          <strong>{campaign.channels[0].name}</strong>
                        </CardText>
                        <CardText>
                          <strong>Website:</strong>{' '}
                          <a href='##'>{campaign.channels[0].website}</a>
                        </CardText>
                        <CardText>
                          <strong>Address:</strong>{' '}
                          {campaign.channels[0].address}
                        </CardText>
                        <CardText>
                          <strong>Phone number:</strong>{' '}
                          {campaign.channels[0].phone}
                        </CardText>
                      </>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Status:</strong>
                    </CardSubtitle>
                    <CardText>
                      {renderStatus(
                        campaign.approve,
                        campaign.status,
                        campaign.completed
                      )}
                    </CardText>
                    <CardSubtitle>
                      <strong>Create by:</strong>
                    </CardSubtitle>
                    <CardText>
                      {campaign.user !== undefined ? campaign.user.name : ''}
                    </CardText>
                    <CardSubtitle>
                      <strong>Start date - End date:</strong>
                    </CardSubtitle>
                    {campaign.campaignTTL !== undefined ? (
                      <CardText>
                        {'Từ ' +
                          new Date(
                            campaign.campaignTTL.open_datetime
                          ).toLocaleDateString('en-GB') +
                          ' - Đến ' +
                          new Date(
                            campaign.campaignTTL.close_datetime
                          ).toLocaleDateString('en-GB')}
                      </CardText>
                    ) : (
                      ''
                    )}
                    {campaign.approve == null ? (
                      <div className='form-button'>
                        <Button
                          className='btn-neutral'
                          color='primary'
                          onClick={toggleUnApproveModal}
                        >
                          Reject
                        </Button>
                        <Button color='primary' onClick={toggleApproveModal}>
                          Approve
                        </Button>
                      </div>
                    ) : (
                      ''
                    )}
                    {campaign.influencerCompleted == true &&
                    campaign.completed != true ? (
                      <div className='form-button'>
                        <Button
                          color='primary'
                          onClick={() => handleEmployeeMaskPaid()}
                        >
                          Payment confirmation for Influencer
                        </Button>
                      </div>
                    ) : (
                      ''
                    )}
                  </CardBody>
                </Card>
              </Container>
            </Row>
          </TabPane>
          <TabPane tabId='vertical2'>
            <Row>
              <Col md={6}>
                <h3>Customer info</h3>
                <Card className='single-card'>
                  <CardImg
                    src={renderUserImage()}
                    alt='Card image cap'
                    className='campaign-detail-img'
                  />
                  <CardBody>
                    <CardTitle>{campaign.user.name}</CardTitle>
                    <CardSubtitle>
                      <strong>Gender:</strong>
                    </CardSubtitle>
                    {campaign.user.gender !== undefined ? (
                      <CardText>{campaign.user.gender}</CardText>
                    ) : (
                      'N/A'
                    )}
                    <CardSubtitle>
                      <strong>Date of Birth:</strong>
                    </CardSubtitle>
                    {campaign.user.birthDay !== undefined ? (
                      <CardText>
                        {new Date(campaign.user.birthDay).toLocaleDateString(
                          'en-GB'
                        )}
                      </CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Email:</strong>
                    </CardSubtitle>
                    {campaign.user.email !== undefined ? (
                      <CardText>{campaign.user.email}</CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Address:</strong>
                    </CardSubtitle>
                    {campaign.user.address !== undefined ? (
                      <CardText>{campaign.user.address}</CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Phone number:</strong>
                    </CardSubtitle>
                    {campaign.user.phoneNumber !== undefined ? (
                      <CardText>{campaign.user.phoneNumber}</CardText>
                    ) : (
                      ''
                    )}
                    <br /> <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className='form-button'>
                      <a
                        href={`mailto:${campaign.user.email}?subject=Campaign - ${campaign.title}-TrendzNetwork`}
                      >
                        <Button color='primary'>Contact now!</Button>
                      </a>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6}>
                <h3>Influencer info</h3>
                <Card className='single-card'>
                  {campaign.channels[0].user.avatar !== undefined ? (
                    <CardImg
                      src={renderInfluencerImage()}
                      alt='Card image cap'
                      className='campaign-detail-img'
                    />
                  ) : (
                    <Skeleton variant='rect' width={256} height={186} />
                  )}
                  <CardBody>
                    <CardTitle>{campaign.channels[0].user.name}</CardTitle>
                    <CardSubtitle>
                      <strong>Gender:</strong>
                    </CardSubtitle>
                    {campaign.channels[0].user.gender !== undefined ? (
                      <CardText>{campaign.channels[0].user.gender}</CardText>
                    ) : (
                      'N/A'
                    )}
                    <CardSubtitle>
                      <strong>Date of Birth:</strong>
                    </CardSubtitle>
                    {campaign.channels[0].user.birthDay !== undefined ? (
                      <CardText>
                        {new Date(
                          campaign.channels[0].user.birthDay
                        ).toLocaleDateString('en-GB')}
                      </CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Email:</strong>
                    </CardSubtitle>
                    {campaign.channels[0].user.email !== undefined ? (
                      <CardText>{campaign.channels[0].user.email}</CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Address:</strong>
                    </CardSubtitle>
                    {campaign.channels[0].user.address !== undefined ? (
                      <CardText>{campaign.channels[0].user.address}</CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Phone number:</strong>
                    </CardSubtitle>
                    {campaign.channels[0].user.phoneNumber !== undefined ? (
                      <CardText>
                        {campaign.channels[0].user.phoneNumber}
                      </CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Channel:</strong>
                    </CardSubtitle>
                    {campaign.channels[0] !== undefined ? (
                      <>
                        <CardText>
                          <strong>{campaign.channels[0].name}</strong>
                        </CardText>
                        <CardText>
                          <strong>Website:</strong>{' '}
                          <a href='##'>{campaign.channels[0].website}</a>
                        </CardText>
                        <CardText>
                          <strong>Address:</strong>{' '}
                          {campaign.channels[0].address}
                        </CardText>
                        <CardText>
                          <strong>Phone number:</strong>{' '}
                          {campaign.channels[0].phone}
                        </CardText>
                      </>
                    ) : (
                      ''
                    )}
                    <div className='form-button'>
                      <a
                        href={`mailto:${campaign.channels[0].user.email}?subject=Campaign - ${campaign.title}-TrendzNetwork`}
                      >
                        <Button color='primary'>Contact now!</Button>
                      </a>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId='vertical3'>
            <Row>
              <Timeline align='alternate'>
                <TimelineItem>
                  <TimelineOppositeContent>
                    <Typography variant='body2' color='textSecondary'>
                      {new Date(campaign.created_at).toLocaleString('en-GB')}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot className={classes.success}>
                      <CheckIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                      <p>
                        <strong>Created by</strong>
                      </p>
                      <CardText>{campaign.user.name}</CardText>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>

                {campaign.approve == null ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.processing}>
                        <SyncIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Censorship</p>
                        <CardText>
                          The TrendzNetwork system is processing the request
                        </CardText>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : campaign.approve == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.success}>
                        <CheckIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Censorship</p>
                        <p>The TrendzNetwork system approved the request</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : campaign.approve == false ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.error}>
                        <CloseIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Censorship</p>
                        <p> TrendzNetwork system rejected the request </p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}

                {campaign.status == null && campaign.approve == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.processing}>
                        <SyncIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Sent request to Influencer:</p>
                        <p>Influencer is reviewing the request</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : campaign.status == false && campaign.approve == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.error}>
                        <CloseIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Influencer:</p>
                        <p>Influencer declined the request</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : campaign.status == true && campaign.approve == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.success}>
                        <CheckIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Influencer:</p>
                        <p>Influencer has approved the request</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}

                {campaign.status == true &&
                campaign.approve == true &&
                campaign.influencerCompleted == false ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.processing}>
                        <SyncIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Influencer:</p>
                        <p>Influencer initiate the campaign</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : campaign.status == true &&
                  campaign.approve == true &&
                  campaign.influencerCompleted == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.success}>
                        <CheckIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Influencer:</p>
                        <p>Influencer has completed the campaign</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : campaign.influencerCompleted == null ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.processing}>
                        <SyncIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Waiting</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}

                {/* completed */}
                {campaign.status == true &&
                campaign.approve == true &&
                campaign.influencerCompleted == true &&
                campaign.completed == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.success}>
                        <CheckIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>TrendzNetwork:</p>
                        <p>Paid for Influencer</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : campaign.status == true &&
                  campaign.approve == true &&
                  campaign.influencerCompleted == true &&
                  campaign.completed == false ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.processing}>
                        <SyncIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Waiting:</p>
                        <p>TrendzNetwork are paying for influencer</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : campaign.influencerCompleted == false ||
                  campaign.influencerCompleted == null ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.error}>
                        <LockIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Blocked</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}
              </Timeline>
            </Row>
          </TabPane>
        </TabContent>
      </Col>
    </Row>
  );
};

export default Employee;
