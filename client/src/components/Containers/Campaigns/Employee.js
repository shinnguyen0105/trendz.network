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

  const classes = useStyles();

  const { state } = useAuth();

  const [navState, setNav] = useState({
    vertical: 1,
  });

  const [employeeApprove, setEmployeeApprove] = useState();
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
      variables: {
        id: cid,
        approve: employeeApprove,
        notee: note.note,
      },
    }
  );

  //employee approve/unapprove campaign
  const handleEmployeeApproval = async (approved) => {
    await setEmployeeApprove(approved);
    try {
      await requestUpdateCampaignMutation();
      if (approved) {
        enqueueSnackbar('Đã chấp thuận campaign!', { variant: 'success' });
      } else enqueueSnackbar('Đã từ chối campaign!', { variant: 'warning' });
      Router.push('/dashboard');
    } catch (e) {
      console.log(e);
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại!', {
        variant: 'error',
      });
    }
    return;
  };

  const renderApproveModal = () => {
    return (
      <Modal isOpen={approveModal} toggle={toggleApproveModal}>
        <div className='modal-header'>
          <h4 className='modal-title' id='avatarModal'>
            <strong>Duyệt Campaign</strong>
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
              Bạn có thật sự muốn duyệt Campaign này? Hãy để lại nhận xét:
            </Label>
            <Input
              type='textarea'
              id='content'
              placeholder='Nhận xét...'
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
            Hủy
          </Button>
          <Button
            color='primary'
            disabled={note.note == null ? true : false}
            onClick={() => {
              try {
                handleEmployeeApproval(true);
              } catch (error) {
                enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại!', {
                  variant: 'error',
                });
              }
              toggleApproveModal();
            }}
          >
            Xác nhận
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
            <strong>Từ chối Campaign</strong>
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
              Bạn có thật sự muốn từ chối Campaign này? Hãy để lại nhận xét:
            </Label>
            <Input
              type='textarea'
              id='content'
              placeholder='Nhận xét...'
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
            Hủy
          </Button>
          <Button
            color='primary'
            disabled={note.note == null ? true : false}
            onClick={() => {
              try {
                handleEmployeeApproval(false);
              } catch (error) {
                enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại!', {
                  variant: 'error',
                });
              }
              toggleUnApproveModal();
            }}
          >
            Xác nhận
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
      return 'Đang chờ cấp phép';
    }
    if (!approvalStatus) {
      return 'Không được cấp phép';
    }
    if (approvalStatus && influencerStatus == null) {
      return 'Đã được cấp phép - Đang chờ influencer xác nhận';
    }
    if (approvalStatus && !influencerStatus) {
      return 'Đã được cấp phép - Influencer đã từ chối';
    }
    if (approvalStatus && influencerStatus && status == false) {
      return 'Đã được cấp phép - Influencer đã chấp thuận - Đang hoạt động';
    } else return 'Đã được cấp phép - Influencer đã chấp thuận - Đã kết thúc';
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
                      <strong>Thể loại:</strong>
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
                      <strong>Kênh:</strong>
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
                          <strong>Địa chỉ:</strong>{' '}
                          {campaign.channels[0].address}
                        </CardText>
                        <CardText>
                          <strong>Liên hệ:</strong> {campaign.channels[0].phone}
                        </CardText>
                      </>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Trạng thái:</strong>
                    </CardSubtitle>
                    <CardText>
                      {renderStatus(
                        campaign.approve,
                        campaign.status,
                        campaign.completed
                      )}
                    </CardText>
                    <CardSubtitle>
                      <strong>Người tạo:</strong>
                    </CardSubtitle>
                    <CardText>
                      {campaign.user !== undefined
                        ? campaign.user.username
                        : ''}
                    </CardText>
                    <CardSubtitle>
                      <strong>Thời gian:</strong>
                    </CardSubtitle>
                    {campaign.campaignTTL[0] !== undefined ? (
                      <CardText>
                        {'Từ ' +
                          new Date(
                            campaign.campaignTTL[0].open_datetime
                          ).toLocaleDateString('en-GB') +
                          ' - Đến ' +
                          new Date(
                            campaign.campaignTTL[0].close_datetime
                          ).toLocaleDateString('en-GB')}
                      </CardText>
                    ) : (
                      ''
                    )}
                    <div className='form-button'>
                      <Button
                        className='btn-neutral'
                        color='primary'
                        onClick={toggleUnApproveModal}
                      >
                        Từ chối
                      </Button>
                      <Button color='primary' onClick={toggleApproveModal}>
                        Xác nhận
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Container>
            </Row>
          </TabPane>
          <TabPane tabId='vertical2'>
            <Row>
              <Col md={6}>
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
                      <strong>Giới tính:</strong>
                    </CardSubtitle>
                    {campaign.user.gender !== undefined ? (
                      <CardText>
                        {campaign.user.gender === 'male' ? 'Nam' : 'Nữ'}
                      </CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Ngày sinh:</strong>
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
                      <strong>Địa chỉ:</strong>
                    </CardSubtitle>
                    {campaign.user.address !== undefined ? (
                      <CardText>{campaign.user.address}</CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Số điện thoại:</strong>
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
                      <Button color='primary'>Liên hệ ngay!</Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6}>
                <h3>Thông tin Influencer</h3>
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
                      <strong>Giới tính:</strong>
                    </CardSubtitle>
                    {campaign.channels[0].user.gender !== undefined ? (
                      <CardText>
                        {campaign.channels[0].user.gender === 'male'
                          ? 'Nam'
                          : 'Nữ'}
                      </CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Ngày sinh:</strong>
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
                      <strong>Địa chỉ:</strong>
                    </CardSubtitle>
                    {campaign.channels[0].user.address !== undefined ? (
                      <CardText>{campaign.channels[0].user.address}</CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Số điện thoại:</strong>
                    </CardSubtitle>
                    {campaign.channels[0].user.phoneNumber !== undefined ? (
                      <CardText>
                        {campaign.channels[0].user.phoneNumber}
                      </CardText>
                    ) : (
                      ''
                    )}
                    <CardSubtitle>
                      <strong>Kênh:</strong>
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
                          <strong>Địa chỉ:</strong>{' '}
                          {campaign.channels[0].address}
                        </CardText>
                        <CardText>
                          <strong>Liên hệ:</strong> {campaign.channels[0].phone}
                        </CardText>
                      </>
                    ) : (
                      ''
                    )}
                    <div className='form-button'>
                      <Button color='primary'>Liên hệ ngay!</Button>
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
                        <strong>Khởi tạo</strong>
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
                        <p>Kiểm duyệt</p>
                        <CardText>Hệ thống TrendZ đang xử lý yêu cầu</CardText>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}
                {campaign.approve == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.success}>
                        <CheckIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Kiểm duyệt</p>
                        <p>Hệ thống TrendZ đã duyệt yêu cầu</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}
                {campaign.approve == false ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.error}>
                        <CloseIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Kiểm duyệt</p>
                        <p>Hệ thống TrendZ đã từ chối yêu cầu</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}
                {campaign.status == false && campaign.approve == null ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.inactive}>
                        <LockIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Thông tin đến Influencer</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}
                {campaign.status == null && campaign.approve == null ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.inactive}>
                        <LockIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Thông tin đến Influencer</p>
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
                        <p>Thông tin đến Influencer</p>
                        <p>Influencer đang xem xét yêu cầu</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}
                {campaign.status == false && campaign.approve == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.error}>
                        <CloseIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Thông tin từ Influencer</p>
                        <p>Influencer đã từ chối yêu cầu</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}
                {campaign.status == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.success}>
                        <CheckIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Thông tin từ Influencer</p>
                        <p>Influencer đã chấp thuận yêu cầu</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}
                {campaign.completed == null && campaign.status == null ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.inactive}>
                        <LockIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>(Dự kiến) Kết thúc</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ''
                )}
                {campaign.completed == false && campaign.status == true ? (
                  <>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        <Typography variant='body2' color='textSecondary'>
                          {new Date(
                            campaign.campaignTTL[0].open_datetime
                          ).toLocaleString('en-GB')}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot className={classes.processing}>
                          <SyncIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper elevation={3} className={classes.paper}>
                          <p>Thực thi</p>
                          <p>Influencer đang thực hiện</p>
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        <Typography variant='body2' color='textSecondary'>
                          {new Date(
                            campaign.campaignTTL[0].close_datetime
                          ).toLocaleString('en-GB')}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot className={classes.inactive}>
                          <LockIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper elevation={3} className={classes.paper}>
                          <p>(Dự kiến) Kết thúc</p>
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  </>
                ) : (
                  ''
                )}
                {campaign.completed == true && campaign.status == true ? (
                  <>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        <Typography variant='body2' color='textSecondary'>
                          {new Date(
                            campaign.campaignTTL[0].open_datetime
                          ).toLocaleString('en-GB')}
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
                          <p>Thực thi</p>
                          <p>Influencer đã hoàn tất yêu cầu</p>
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        <Typography variant='body2' color='textSecondary'>
                          {new Date(
                            campaign.campaignTTL[0].close_datetime
                          ).toLocaleString('en-GB')}
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
                          <p>Hoàn thành</p>
                          <p>
                            Influencer đã hoàn thành yêu cầu, dự án kết thúc!
                          </p>
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  </>
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
