import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { useQuery, useMutation } from 'react-apollo';
import { useAuth } from '../../../contexts/userContext';

import axios from 'axios';

import { REQUEST_GET_ALL_CATEGORIES } from '../../../graphql/query/category/getCategory';
import { REQUEST_GET_ALL_CATEGORIES_CHANNELS } from '../../../graphql/query/category/getCategory';
import { REQUEST_UPDATE_CAMPAIGN } from '../../../graphql/mutations/campaign/updateCampaign';
import { REQUEST_DELETE_CAMPAIGN } from '../../../graphql/mutations/campaign/deleteCampaign';
import { REQUEST_SEND_CHAT_BY_CUSTOMER } from '../../../graphql/mutations/message/sendChat';
import { UPDATE_CAMPAIGN_FRAGMENT } from '../../../graphql/fragments/editcampaign';
import Datetime from 'react-datetime';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardTitle,
  CardText,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  TabContent,
  TabPane,
  Col,
  Nav,
  NavLink,
  NavItem,
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
import { Editor } from '@tinymce/tinymce-react';
import { TrafficOutlined } from '@material-ui/icons';

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

const Customer = ({ campaign, cid }) => {
  const { state } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [tempCampaign, setTempCampaign] = useState(campaign);
  const [navState, setNav] = useState({
    vertical: 1,
  });
  const classes = useStyles();
  const [date, setDate] = useState(Datetime.moment().subtract(1, 'day'));

  const [tempData, setTempData] = useState({
    categoryId: '',
    categoryName: '',
    channelId: tempCampaign.channels[0].id,
    channelName: tempCampaign.channels[0].name,
    open_date: tempCampaign.campaignTTL.open_datetime,
    close_date: tempCampaign.campaignTTL.close_datetime,
    price: tempCampaign.price,
  });

  const [isAbleToSend, setIsAbleToSend] = useState(true);

  const [campaignModal, setCampaignModal] = useState(false);
  const toggleCampaignModal = () => {
    setCampaignModal(!campaignModal);
  };

  const [chatModal, setChatModal] = useState(false);
  const [contentChat, setContentChat] = useState(campaign.messages);
  console.log('message', contentChat);
  const toggleChatModal = () => {
    setChatModal(!chatModal);
    setMesage('');
  };

  const [message, setMesage] = useState('');

  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  useEffect(() => {
    if (message !== '') {
      setIsAbleToSend(false);
    }
  }, [message]);

  var valid = function (current) {
    return current.isAfter(date);
  };

  var validStartDate = function (current) {
    return current.isAfter(Datetime.moment().subtract(1, 'day'));
  };

  //creator edit campaign
  const handleCampaignChange = (event) => {
    const { name, value } = event.target;
    setTempCampaign((previousState) => {
      return { ...previousState, [name]: value };
    });
  };
  const handleContentChange = (content, editor) => {
    setTempCampaign((previousState) => {
      return { ...previousState, content };
    });
  };
  const handleStartDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d.toISOString();
      setTempCampaign((previousState) => {
        return {
          ...previousState,
          campaignTTL: {
            open_datetime: value,
            close_datetime: previousState.campaignTTL.close_datetime,
          },
        };
      });
      //console.log('start date: ', value);
      setDate(value);
    } else return;
  };
  const handleEndDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d.toISOString();
      setTempCampaign((previousState) => {
        return {
          ...previousState,
          campaignTTL: {
            open_datetime: previousState.campaignTTL.open_datetime,
            close_datetime: value,
          },
        };
      });
      //console.log('start date: ', event._d);
    } else return;
  };

  const handleCategoryChange = (id, name) => {
    setTempCampaign((previousState) => {
      return {
        ...previousState,
        category: {
          id: id,
          name: name,
        },
      };
    });
    setTempData({
      categoryId: id,
      categoryName: name,
      channelId: '',
      channelName: '',
    });
  };

  const handleChannelsChange = (id, name) => {
    setTempData((previousState) => {
      return {
        ...previousState,
        channelId: id,
        channelName: name,
      };
    });
  };

  const [
    requestSendMessageMutation,
    { loading: requestSendLoading },
  ] = useMutation(REQUEST_SEND_CHAT_BY_CUSTOMER, {
    update(cache, { data: { createMessage } }) {
      //console.log('abc: ', createMessage.message);
      let content = createMessage.message;
      setContentChat((prev) => {
        return [...prev, content];
      });
    },
  });
  const handleCustomerSendMessage = async () => {
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

  console.log('temp campaign: ', tempCampaign);

  function FetchCategories() {
    const { loading, error, data } = useQuery(REQUEST_GET_ALL_CATEGORIES);
    if (loading) return <Skeleton />;
    if (error) return null;
    // console.log('categories: ', data);
    return (
      <>
        <DropdownToggle
          caret
          color='secondary'
          data-toggle='dropdown'
          className='mydropdown'
        >
          {tempCampaign.category.name !== null
            ? tempCampaign.category.name
            : 'Select Category'}
        </DropdownToggle>
        <DropdownMenu>
          {data.categories.map((category) => (
            <DropdownItem
              key={category.id}
              onClick={(event) => {
                event.preventDefault();
                handleCategoryChange(category.id, category.name);
              }}
            >
              {category.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </>
    );
  }
  function FetchChannels() {
    const { loading, error, data } = useQuery(
      REQUEST_GET_ALL_CATEGORIES_CHANNELS
    );
    if (loading) return <Skeleton />;
    if (error) return null;
    //    console.log(data.categories.find((x) => x.id == 1));
    return (
      <>
        <DropdownToggle caret color='secondary' data-toggle='dropdown'>
          {tempCampaign.channels[0].name === null
            ? 'Select channel...'
            : tempData.channelName}
        </DropdownToggle>
        {tempCampaign.category.name !== null ? (
          <DropdownMenu>
            {data.categories
              .find((x) => x.id == tempCampaign.category.id)
              .channels.map((channel) => (
                <DropdownItem
                  key={channel.id}
                  onClick={(event) => {
                    event.preventDefault();
                    handleChannelsChange(channel.id, channel.name);
                  }}
                >
                  {channel.name}
                </DropdownItem>
              ))}
          </DropdownMenu>
        ) : (
          <div></div>
        )}
      </>
    );
  }
  //useEffect to fetch price of channel to cacular price for campaign
  useEffect(() => {
    if (
      tempData.channelId !== tempCampaign.channels[0].id ||
      tempData.open_date !== tempCampaign.campaignTTL.open_datetime ||
      tempData.close_date !== tempCampaign.campaignTTL.close_datetime
    ) {
      const fetchPriceChannel = async () => {
        const url = API_URL + '/channels?_where[id]=' + tempData.channelId;
        try {
          const get_resolve = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          var start_new = new Date(tempCampaign.campaignTTL.open_datetime);
          var end_new = new Date(tempCampaign.campaignTTL.close_datetime);
          var difference_new = Math.abs(end_new - start_new);
          var totalDays_new = difference_new / (1000 * 3600 * 24);
          var priceCampaign = totalDays_new * get_resolve.data[0].price;
          setTempData((prev) => {
            return {
              ...prev,
              price: priceCampaign,
            };
          });
        } catch (error) {
          console.log('Error: ', error.message);
        }
      };
      fetchPriceChannel();
      console.log(tempData.price);
    }
  }, [
    tempData.channelId,
    tempCampaign.campaignTTL.open_datetime,
    tempCampaign.campaignTTL.close_datetime,
  ]);

  const [
    requestUpdateCampaignMutation,
    { loading: requestUpdateCampaignLoading },
  ] = useMutation(REQUEST_UPDATE_CAMPAIGN, {
    // update(cache, { data: { updateCampaign } }) {
    //   let channelsNew = updateCampaign.campaign.channels;
    //   setTempCampaign((previousState) => {
    //     return { ...previousState, channelsNew };
    //   });
    // },
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
  });
  const handleEditSubmit = async () => {
    try {
      await requestUpdateCampaignMutation({
        variables: {
          id: cid,
          title: tempCampaign.title,
          content: tempCampaign.content,
          category: parseInt(tempCampaign.category.id),
          channels: parseInt(tempData.channelId),
          price: tempData.price,
          open_datetime: tempCampaign.campaignTTL.open_datetime,
          close_datetime: tempCampaign.campaignTTL.close_datetime,
        },
      });
      enqueueSnackbar('Successful editing!', {
        variant: 'success',
      });
    } catch (e) {
      enqueueSnackbar('Editing failed!', {
        variant: 'error',
      });
      console.log(e);
    }
  };

  //creator delete campaign
  const [requestDeletePostMutation] = useMutation(REQUEST_DELETE_CAMPAIGN, {
    update(cache, { data: { deleteCampaign } }) {
      cache.modify({
        fields: {
          campaigns(existingCampaigns, { readField }) {
            const newCampaigns = existingCampaigns.filter(
              (postRef) =>
                readField('id', postRef) !== deleteCampaign.campaign.id
            );
            return newCampaigns;
          },
        },
      });
    },
  });

  const handleDelete = async () => {
    try {
      await requestDeletePostMutation({
        variables: {
          id: campaign.id,
        },
      });
    } catch (e) {
      console.log(e);
    }
    return;
  };

  const renderImage = () => {
    if (campaign.picture[0] !== undefined) {
      if (campaign.picture[0].formats.medium !== undefined) {
        return API_URL + campaign.picture[0].formats.medium.url;
      } else if (campaign.picture[1].formats.medium !== undefined) {
        return API_URL + campaign.picture[1].formats.medium.url;
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
  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
  };
  const renderDeleteModal = () => {
    return (
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <div className='modal-header'>
          <h4 className='modal-title' id='avatarModal'>
            <strong>Delete Campaign</strong>
          </h4>
          <button
            type='button'
            className='close'
            data-dismiss='modal'
            aria-hidden='true'
            onClick={toggleDeleteModal}
          >
            <i className='tim-icons icon-simple-remove' />
          </button>
        </div>
        <ModalBody>
          <FormGroup className='modal-items'>
            <Label>Do you really want to delete this Campaign?</Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button
            color='primary'
            onClick={() => {
              try {
                handleDelete();
                enqueueSnackbar('Xóa campaign thành công!', {
                  variant: 'success',
                });
                Router.push('/dashboard');
              } catch (error) {
                enqueueSnackbar('Xóa campaign không thành công!', {
                  variant: 'error',
                });
              }
              toggleDeleteModal();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    );
  };
  const renderEditModal = () => {
    return (
      <Modal isOpen={campaignModal} toggle={toggleCampaignModal}>
        <div className='modal-header'>
          <h4 className='modal-title' id='avatarModal'>
            <strong>Update Campaign</strong>
          </h4>
          <button
            type='button'
            className='close'
            data-dismiss='modal'
            aria-hidden='true'
            onClick={toggleCampaignModal}
          >
            <i className='tim-icons icon-simple-remove' />
          </button>
        </div>
        <ModalBody>
          <Form className='form'>
            <FormGroup className='modal-items'>
              <Label for='title'>Title</Label>
              <Input
                type='text'
                id='title'
                name='title'
                onChange={handleCampaignChange}
                value={tempCampaign.title}
                placeholder='Title...'
                required
                className='modal-items'
              />
            </FormGroup>
            <FormGroup className='modal-items'>
              <Label for='content'>Content</Label>
              <Editor
                apiKey='rra7fcsvr0q6e0fws0mvcj75edqjwjwz9glbrvv24pljw2yp'
                id='content'
                placeholder='Nội dung...'
                onEditorChange={handleContentChange}
                value={tempCampaign.content}
                required
              />
            </FormGroup>
            <div className='form-row'>
              <FormGroup className='col-md-5'>
                <Label for='startDate' className='modal-items'>
                  Start date:
                </Label>
                <Datetime
                  onChange={handleStartDateChange}
                  value={new Date(tempCampaign.campaignTTL.open_datetime)}
                  required
                  isValidDate={validStartDate}
                  className='modal-items bg-custom'
                />
              </FormGroup>
              <FormGroup className='col-md-5'>
                <Label for='endDate' className='modal-items'>
                  End date:
                </Label>
                <Datetime
                  onChange={handleEndDateChange}
                  value={new Date(tempCampaign.campaignTTL.close_datetime)}
                  required
                  isValidDate={valid}
                  className='modal-items bg-custom'
                />
              </FormGroup>
            </div>
            <div className='form-row'>
              <FormGroup className='col-md-4'>
                <Label for='channel' className='modal-items'>
                  Category
                </Label>
                <br />
                <UncontrolledDropdown group>
                  <FetchCategories />
                </UncontrolledDropdown>
              </FormGroup>
              <FormGroup className='col-md-4'>
                <Label for='channel' className='modal-items'>
                  Channel
                </Label>
                <br />
                <UncontrolledDropdown group>
                  <FetchChannels />
                </UncontrolledDropdown>
              </FormGroup>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={toggleCampaignModal}>
            Cancel
          </Button>
          <Button
            color='primary'
            onClick={() => {
              try {
                handleEditSubmit();
                toggleCampaignModal();
                // Router.reload();
              } catch (e) {
                console.log(e);
                toggleCampaignModal();
              }
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <Row>
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
              Campaign tracking
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <Col>
        <TabContent activeTab={'vertical' + navState.vertical}>
          <TabPane tabId='vertical1'>
            <Row>
              {campaign.completed === null ? renderEditModal() : ''}
              {campaign.completed === null ? renderDeleteModal() : ''}
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
                    <div className='form-button'>
                      <Button
                        className='btn-neutral'
                        color='primary'
                        onClick={toggleCampaignModal}
                        disabled={campaign.completed === null ? false : true}
                      >
                        Edit
                      </Button>
                      <Button
                        color='primary'
                        onClick={toggleDeleteModal}
                        disabled={campaign.completed === null ? false : true}
                      >
                        Delete
                      </Button>
                      <a
                        href={`mailto:trendz.networksys@gmail.com?subject=Campaign - ${campaign.title} - TrendzNetwork`}
                      >
                        <Button color='success'>Contact TrendZ</Button>
                      </a>
                    </div>
                  </CardBody>
                </Card>
              </Container>
            </Row>
          </TabPane>
          <TabPane tabId='vertical2'>
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
              <Modal isOpen={chatModal} toggle={toggleChatModal}>
                <div className='modal-header'>
                  <h4 className='modal-title' id='avatarModal'>
                    <strong>{campaign.channels[0].user.name}</strong>
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
                        if (chat.userMessage !== null) {
                          return (
                            <div className='d-flex justify-content-end' key={i}>
                              <div className='pt-2 pl-2 pr-2 justify-content-start wrap bg-info my-2 rounded w-50'>
                                <p> {chat.userMessage}</p>
                                <p className='create-at-message'>
                                  <i className='tim-icons icon-check-2' />
                                  {new Date(chat.created_at).toLocaleDateString(
                                    'en-US'
                                  ) +
                                    new Date(
                                      chat.created_at
                                    ).toLocaleTimeString('en-US')}
                                </p>
                              </div>
                            </div>
                          );
                        }
                        if (chat.influencerMessage !== null) {
                          return (
                            <div
                              className=' wrap pt-2 pl-2 pr-2 bg-success my-2 rounded w-50'
                              key={i}
                            >
                              <p>
                                {chat.influencerMessage} <br />
                              </p>
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
                      disabled={isAbleToSend}
                      onClick={() => {
                        handleCustomerSendMessage();
                        setMesage('');
                      }}
                    >
                      <i className='tim-icons icon-send' />
                    </button>
                  </FormGroup>
                </ModalFooter>
              </Modal>
            </Row>
            <div
              className='form-button margin-button'
              onClick={() => {
                toggleChatModal();
                setMesage('');
              }}
            >
              <Button color='primary'>Chat Message</Button>
            </div>
          </TabPane>
        </TabContent>
      </Col>
    </Row>
  );
};

export default Customer;
