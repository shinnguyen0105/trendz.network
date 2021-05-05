import React, { useEffect, useState } from 'react';

import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { REQUEST_UPDATE_CAMPAIGN_INFLUENCER } from '../../../graphql/mutations/campaign/updateCampaign';
import { REQUEST_SEND_CHAT_BY_INFLUENCER } from '../../../graphql/mutations/message/sendChat';

import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardTitle,
  CardText,
  Row,
  Col,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
} from 'reactstrap';
import { useSnackbar } from 'notistack';
import classnames from 'classnames';
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
import { makeStyles, Typography, Paper } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import SyncIcon from '@material-ui/icons/Sync';
import LockIcon from '@material-ui/icons/Lock';

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

const { API_URL } = process.env;

const Influencer = ({ campaign, cid }) => {
  console.log(campaign);
  const [navState, setNav] = useState({
    vertical: 1,
  });
  const { enqueueSnackbar } = useSnackbar();

  const [chatModal, setChatModal] = useState(false);
  const [contentChat, setContentChat] = useState(campaign.messages);
  const toggleChatModal = () => {
    setChatModal(!chatModal);
  };

  const [message, setMesage] = useState('');
  const [
    requestSendMessageMutation,
    { loading: requestSendLoading },
  ] = useMutation(REQUEST_SEND_CHAT_BY_INFLUENCER, {
    update(cache, { data: { createMessage } }) {
      //console.log('abc: ', createMessage.message);
      let content = createMessage.message;
      setContentChat((prev) => {
        return [...prev, content];
      });
    },
  });
  //update Cached pls
  const handleInfluencerSendMessage = async () => {
    try {
      await requestSendMessageMutation({
        variables: {
          input: message,
          campaign: campaign.id,
        },
      });
    } catch (e) {
      console.log(e);
    }
    return;
  };

  const classes = useStyles();
  const [
    requestUpdateCampaignMutation,
    { loading: requestUpdateCampaignLoading },
  ] = useMutation(REQUEST_UPDATE_CAMPAIGN_INFLUENCER);

  const handleInfluencerApproval = async (status) => {
    try {
      await requestUpdateCampaignMutation({
        variables: {
          id: cid,
          status: status,
          InfluencerCompleted: false,
        },
      });
      if (status) {
        enqueueSnackbar('Approved campaign!', { variant: 'success' });
      } else enqueueSnackbar('Rejected the campaign!', { variant: 'success' });
    } catch (e) {
      console.log(e);
      enqueueSnackbar('An error has occurred, please try again!', {
        variant: 'error',
      });
    }
    return;
  };

  const handleInfluencerMaskCompleted = async () => {
    try {
      await requestUpdateCampaignMutation({
        variables: {
          id: cid,
          InfluencerCompleted: true,
        },
      });
      enqueueSnackbar('Mask Campaign completed!', {
        variant: 'success',
      });
      //Router.push('/dashboard');
    } catch (e) {
      console.log(e);
      enqueueSnackbar('Error during mask completed!', {
        variant: 'error',
      });
    }
    return;
  };
  const renderImage = () => {
    if (campaign.picture[0] !== undefined) {
      return API_URL + campaign.picture[0].url;
    } else return '/256x186.svg';
  };
  const renderUserImage = () => {
    if (campaign.user.avatar !== undefined) {
      if (campaign.user.avatar.formats.thumbnail !== undefined) {
        return API_URL + campaign.user.avatar.formats.thumbnail.url;
      } else return API_URL + campaign.user.avatar.url;
    } else return '/256x186.svg';
  };
  const renderStatus = (approvalStatus, influencerStatus, status) => {
    if (approvalStatus == true && influencerStatus == null) {
      return 'Waiting for Influencer approval';
    }
    if (approvalStatus == true && influencerStatus == true) {
      return 'Approved - Ongoing';
    }
    if (approvalStatus == true && influencerStatus == false) {
      return 'Licensed - Influencer declined';
    }
    if (approvalStatus && influencerStatus && status == false) {
      return 'Unlicensed';
    } else return 'Licensed - Influencer approved - Ended';
  };
  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
  };

  return (
    <Row>
      <Modal isOpen={chatModal} toggle={toggleChatModal}>
        <div className='modal-header'>
          <h4 className='modal-title' id='avatarModal'>
            <strong>{campaign.user.name}</strong>
          </h4>
          <button
            type='button'
            className='close'
            data-dismiss='modal'
            aria-hidden='true'
            onClick={() => {
              toggleChatModal();
            }}
          >
            <i className='tim-icons icon-simple-remove' />
          </button>
        </div>
        <ModalBody>
          <div className='wrapper-chat'>
            <div className='content-chat'>
              {contentChat.map((chat, i) => {
                if (chat.influencerMessage !== null) {
                  return (
                    <div className='d-flex justify-content-end' key={i}>
                      <div className='p-2 justify-content-start wrap bg-info my-2 rounded w-50'>
                        <p>{chat.influencerMessage}</p>
                        <p className='create-at-message'>
                          <i className='tim-icons icon-check-2' />
                          {new Date(chat.created_at).toLocaleDateString(
                            'en-US'
                          ) +
                            new Date(chat.created_at).toLocaleTimeString(
                              'en-US'
                            )}
                        </p>
                      </div>
                    </div>
                  );
                }
                if (chat.userMessage !== null) {
                  return (
                    <div
                      className='wrap p-2 bg-success my-2 rounded w-50'
                      key={i}
                    >
                      <p> {chat.userMessage}</p>
                      <div>
                        <p className='create-at-message'>
                          <i className='tim-icons icon-check-2' />
                          {new Date(chat.created_at).toLocaleDateString(
                            'en-US'
                          ) +
                            new Date(chat.created_at).toLocaleTimeString(
                              'en-US'
                            )}
                        </p>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <FormGroup className='w-100 d-flex nowrap'>
            <Input
              placeholder='Write your message...'
              value={message}
              onChange={(e) => setMesage(e.target.value)}
              className='text-dark'
            />
            <button
              type='button'
              className='close'
              data-dismiss='modal'
              aria-hidden='true'
              disabled={requestSendLoading}
              onClick={() => {
                handleInfluencerSendMessage();
                setMesage('');
              }}
            >
              <i className='tim-icons icon-send' />
            </button>
          </FormGroup>
        </ModalFooter>
      </Modal>
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
                {campaign !== undefined ? (
                  <Card className='single-card'>
                    <CardImg
                      src={renderImage()}
                      alt={campaign.title + 'campaign at trendz network'}
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
                        <strong>Price:</strong>
                      </CardSubtitle>
                      <CardText>
                        {campaign.price !== null
                          ? campaign.price.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })
                          : ''}
                      </CardText>
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
                          {'From ' +
                            new Date(
                              campaign.campaignTTL.open_datetime
                            ).toLocaleDateString('en-GB') +
                            ' - To ' +
                            new Date(
                              campaign.campaignTTL.close_datetime
                            ).toLocaleDateString('en-GB')}
                        </CardText>
                      ) : (
                        ''
                      )}
                      {campaign.status == null ? (
                        <div className='form-button'>
                          <Button
                            className='btn-neutral'
                            color='primary'
                            disabled={requestUpdateCampaignLoading}
                            onClick={() => handleInfluencerApproval(false)}
                          >
                            Reject
                          </Button>
                          <Button
                            color='primary'
                            loading={requestUpdateCampaignLoading}
                            onClick={() => handleInfluencerApproval(true)}
                          >
                            Approve
                          </Button>
                        </div>
                      ) : (
                        ' '
                      )}
                      {campaign.influencerCompleted == false &&
                      campaign.status == true ? (
                        <div className='form-button'>
                          <Button
                            onClick={() => handleInfluencerMaskCompleted()}
                            color='primary'
                          >
                            Mask as Completed
                          </Button>
                        </div>
                      ) : (
                        ''
                      )}
                    </CardBody>
                  </Card>
                ) : (
                  <Card className='single-card'>
                    <Skeleton variant='rect' width={256} height={186} />
                    <Skeleton variant='text' />
                    <Skeleton variant='text' />
                  </Card>
                )}
              </Container>
            </Row>
          </TabPane>
          <TabPane tabId='vertical2'>
            <Row>
              <Col sm='12' md={{ size: 6, offset: 3 }}>
                <h3>Thông tin người tạo</h3>
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
                      <CardText>
                        {campaign.user.gender === 'male' ? 'Nam' : 'Nữ'}
                      </CardText>
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
                <div className='form-button text-right'>
                  <Button color='primary' onClick={toggleChatModal}>
                    Chat Message
                  </Button>
                </div>
              </Timeline>
            </Row>
          </TabPane>
        </TabContent>
      </Col>
    </Row>
  );
};

export default Influencer;
