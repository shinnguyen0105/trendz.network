import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-apollo';

import { useAuth } from '../contexts/userContext';
import Router from 'next/router';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Label,
  FormGroup,
  Input,
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
} from 'reactstrap';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { errorLog } from '../utils/functions/error-log-snackbar';
import Datetime from 'react-datetime';
import { Editor } from '@tinymce/tinymce-react';
import { Chip, CircularProgress } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import Skeleton from '@material-ui/lab/Skeleton';

import { REQUEST_GET_ALL_INFLUENCERS } from '../graphql/query/influencer/getInfluencers';

const { API_URL } = process.env;

const Create = () => {
  const { state } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const signal = axios.CancelToken.source();

  const [campaignState, setCampaign] = useState({
    title: '',
    content: '',
    picture: [],
    status: null,
    user: state.user.id,
    category: null,
    open_datetime: new Date().toISOString(),
    close_datetime: new Date().toISOString(),
    approve: null,
    completed: null,
  });
  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);
  const [isMethodDisabled, setIsMethodDisabled] = useState(false);
  const [isCategory, setIsCategory] = useState(true);
  const [isInfluencer, setIsInfluencer] = useState(false);
  //const [isChannelDisabled, setIsChannelDisabled] = useState(true)

  const [typeOfSelection, setTypeOfSelection] = useState('category');

  const [allChannels, setAllChannels] = useState([]);

  const [selectedChannels, setSelectedChannels] = useState([]);

  const [categories, setCategories] = useState({
    categories: [],
  });

  const [influencers, setInfluencers] = useState({
    influencers: [],
  });
  const [emailInfluencer, setEmailInfluencer] = useState([]);
  const [tempData, setTempData] = useState({
    id: '',
    name: '',
    channelId: '',
    channelName: '',
  });

  const [picture, setPicture] = useState({
    file: null,
    loading: false,
    submmited: false,
  });

  const [date, setDate] = useState(Datetime.moment().subtract(1, 'day'));
  var valid = function (current) {
    return current.isAfter(date);
  };

  var validStartDate = function (current) {
    return current.isAfter(Datetime.moment().subtract(1, 'day'));
  };

  const handleCampaignChange = (event) => {
    const { name, value } = event.target;
    setCampaign((previousState) => {
      return { ...previousState, [name]: value };
    });
  };

  const handleContentChange = (content, editor) => {
    setCampaign((previousState) => {
      return { ...previousState, content };
    });
  };

  const handleStartDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d.toISOString();
      setCampaign((previousState) => {
        return {
          ...previousState,
          open_datetime: value,
        };
      });
      setDate(value);
    } else return;
  };

  const handleEndDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d.toISOString();
      setCampaign((previousState) => {
        return {
          ...previousState,
          close_datetime: value,
        };
      });
    } else return;
  };

  const handleImageChange = (event) => {
    setPicture({
      file: event.target.files[0],
      submmited: false,
    });
  };

  const handleSelectType = (name) => {
    setTypeOfSelection(name);
    setTempData({
      id: '',
      name: '',
      channelId: '',
      channelName: '',
    });
  };

  const handleCategoryChange = (id, name) => {
    setTempData({
      id: id,
      name: name,
      channelId: '',
      channelName: '',
    });
    //raw channels
    const allChannelsRaw = categories.categories.find((x) => x.id === id)
      .channels;
    //filter status=true channels
    setAllChannels(allChannelsRaw.filter((x) => x.status === true));
  };

  const handleInfluencerChange = (id, name) => {
    setTempData({
      id: id,
      name: name,
      channelId: '',
      channelName: '',
    });
    // console.log(
    //   influencers.influencers
    //     .find((x) => x.id == id)
    //     .channels.filter((x) => x.status === true)
    // );
    //raw channels
    // const allChannelsRaw = influencers.influencers.find((x) => x.id == id).channels;
    // //filter status=true channels
    setAllChannels(
      influencers.influencers
        .find((x) => x.id == id)
        .channels.filter((x) => x.status === true)
    );
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

  const handleChannelSelect = () => {
    setSelectedChannels((selectedChannels) =>
      selectedChannels.concat(
        allChannels.filter((channel) => channel.id === tempData.channelId)
      )
    );
    setAllChannels(
      allChannels.filter((channel) => channel.id !== tempData.channelId)
    );
    setTempData((previousState) => {
      return {
        ...previousState,
        channelId: '',
        channelName: '',
      };
    });
    console.log(allChannels);
    const FetchInfluencerEmail = async () => {
      const url = API_URL + '/channels/' + tempData.channelId;
      try {
        const get_resolve = await axios.get(url, {
          cancelToken: signal.token,
          headers: {
            Authorization: `Bearer ${state.jwt}`,
          },
        });
        //console.log('dataatatata: ', get_resolve.data);
        setEmailInfluencer([...emailInfluencer, get_resolve.data.user.email]);
        //console.log('arr', [...emailInfluencer, get_resolve.data.user.email]);
      } catch (error) {
        if (axios.isCancel(error) && error.message !== undefined) {
          console.log('Error: ', error.message);
        } else {
          console.log(error);
        }
      }
    };
    FetchInfluencerEmail();
  };

  const handleChannelDeSelect = (id) => () => {
    setAllChannels((allChannels) =>
      allChannels.concat(
        selectedChannels.filter((channel) => channel.id === id)
      )
    );
    setSelectedChannels((selectedChannels) =>
      selectedChannels.filter((channel) => channel.id !== id)
    );
    setTempData((previousState) => {
      return {
        ...previousState,
        channelId: '',
        channelName: '',
      };
    });
    const FetchInfluencerChannelEmail = async () => {
      const url = API_URL + '/users?_where[channels.id]=' + id;
      try {
        const get_resolve = await axios.get(url, {
          cancelToken: signal.token,
          headers: {
            Authorization: `Bearer ${state.jwt}`,
          },
        });
        let temp = get_resolve.data[0].email;
        setEmailInfluencer(
          emailInfluencer.filter(function (email) {
            return email != temp;
          })
        );
        // console.log(
        //   emailInfluencer.filter(function (email) {
        //     return email != temp;
        //   })
        // );
      } catch (error) {
        if (axios.isCancel(error) && error.message !== undefined) {
          console.log('Error: ', error.message);
        } else {
          console.log(error);
        }
      }
    };
    FetchInfluencerChannelEmail();
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    setPicture((previousState) => {
      return {
        ...previousState,
        loading: true,
      };
    });
    const data = new FormData();
    data.append('files', picture.file);
    const upload_resolve = await axios({
      method: 'POST',
      headers: {
        Authorization: `Bearer ${state.jwt}`,
      },
      url: `${API_URL}/upload`,
      data,
    });
    setPicture((previousState) => {
      return {
        ...previousState,
        loading: false,
        submmited: true,
      };
    });
    setCampaign((previousState) => {
      return {
        ...previousState,
        picture: [...previousState.picture, upload_resolve.data[0].id],
      };
    });
  };

  const createCampaign = async (campaign) => {
    try {
      await axios({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${state.jwt}`,
        },
        url: `${API_URL}/campaigns`,
        data: campaign,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const sendMailForInfluencer = async (infor) => {
    try {
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'user_PWL3k2BSLrz7JcZwxx0SN',
          service_id: 'service_0lq6l3d',
          template_id: 'template_f7h28gx',
          template_params: infor,
        }),
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleCampaignSubmit = async () => {
    try {
      emailInfluencer.map((influencer) => {
        var influencerName = influencer.split('@');
        const infor = {
          customer_name: state.user.username,
          campaign_name: campaignState.title,
          start_date: new Date(campaignState.open_datetime).toLocaleDateString(
            'en-GB'
          ),
          end_date: new Date(campaignState.close_datetime).toLocaleDateString(
            'en-GB'
          ),
          influencer_name: influencerName,
          to_email: influencer,
        };
        sendMailForInfluencer(infor);
      });
      selectedChannels.map((channel) => {
        const campaign = {
          title: campaignState.title,
          content: campaignState.content,
          picture: [campaignState.picture[0]],
          status: null,
          user: state.user.id,
          category: channel.category,
          channels: [channel.id],
          campaignTTL: [
            {
              open_datetime: campaignState.open_datetime,
              close_datetime: campaignState.close_datetime,
            },
          ],
          approve: null,
          completed: null,
        };
        createCampaign(campaign);
        Router.push('/dashboard');
      });
      return enqueueSnackbar('Create Campaign success!', {
        variant: 'success',
      });
    } catch (error) {
      return enqueueSnackbar(errorLog(error.message), { variant: 'error' });
    }
  };

  const RenderChips = () => {
    if (selectedChannels.length > 0) {
      return (
        <>
          {selectedChannels.map((channel) => {
            return (
              <ul key={channel.id}>
                <Chip
                  label={channel.name}
                  onDelete={handleChannelDeSelect(channel.id)}
                  color='secondary'
                />
              </ul>
            );
          })}
        </>
      );
    } else return null;
  };
  function FetchInfluencer() {
    const { loading, error, data } = useQuery(REQUEST_GET_ALL_INFLUENCERS);
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    return (
      <DropdownMenu className='dropdown-menu'>
        {data.users.map((user) => (
          <DropdownItem
            key={user.id}
            onClick={(event) => {
              event.preventDefault();
              handleInfluencerChange(user.id, user.name);
            }}
          >
            {user.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    );
  }
  const RenderCategoryOrInfluencerDropdown = () => {
    if (isCategory == true) {
      return (
        <>
          <FormGroup className='col-md-3'>
            <Label for='channel'>Category</Label>
            <br />
            <UncontrolledDropdown group disabled={isMethodDisabled}>
              <DropdownToggle
                caret
                color='secondary'
                data-toggle='dropdown'
                className='mydropdown'
              >
                {tempData.name === '' ? 'Select Category...' : tempData.name}
              </DropdownToggle>
              <DropdownMenu className='dropdown-menu'>
                {categories.categories.map((category) => (
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
            </UncontrolledDropdown>
          </FormGroup>
          <FormGroup className='col-md-3'>
            <Label for='channel'>Channel</Label>
            <br />
            <UncontrolledDropdown group>
              <DropdownToggle caret color='secondary' data-toggle='dropdown'>
                {tempData.channelName === ''
                  ? 'Select Channel...'
                  : tempData.channelName}
              </DropdownToggle>
              {tempData.id !== '' ? (
                <DropdownMenu>
                  {allChannels.map((channel) => (
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
            </UncontrolledDropdown>
          </FormGroup>
          <FormGroup className='col-md-3'>
            <Button
              disabled={tempData.channelName === ''}
              onClick={handleChannelSelect}
            >
              Select
            </Button>
          </FormGroup>
          <br />
        </>
      );
    } else if (isInfluencer) {
      return (
        <>
          <FormGroup className='col-md-3'>
            <Label for='channel'>Select Influencer</Label>
            <br />
            <UncontrolledDropdown group disabled={isMethodDisabled}>
              <DropdownToggle
                caret
                color='secondary'
                data-toggle='dropdown'
                className='mydropdown'
              >
                {tempData.name === '' ? 'Select Influencer...' : tempData.name}
              </DropdownToggle>
              <FetchInfluencer />
            </UncontrolledDropdown>
          </FormGroup>
          <FormGroup className='col-md-3'>
            <Label for='channel'>Channel</Label>
            <br />
            <UncontrolledDropdown group>
              <DropdownToggle caret color='secondary' data-toggle='dropdown'>
                {tempData.channelName === ''
                  ? 'Select Channel...'
                  : tempData.channelName}
              </DropdownToggle>
              {tempData.id !== '' ? (
                <DropdownMenu>
                  {allChannels.map((channel) => (
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
            </UncontrolledDropdown>
          </FormGroup>
          <FormGroup className='col-md-3'>
            <Button
              disabled={tempData.channelName === ''}
              onClick={handleChannelSelect}
            >
              Select
            </Button>
          </FormGroup>
          <br />
        </>
      );
    }
  };

  useEffect(() => {
    if (typeOfSelection === 'category') {
      setIsCategory(true);
      setIsInfluencer(false);
    } else if (typeOfSelection === 'influencer') {
      setIsInfluencer(true);
      setIsCategory(false);
    }
  }, [typeOfSelection]);

  useEffect(() => {
    if (selectedChannels.length > 0) setIsMethodDisabled(true);
  }, [selectedChannels]);

  useEffect(() => {
    if (
      campaignState.content !== '' &&
      campaignState.title !== '' &&
      campaignState.open_datetime !== campaignState.close_datetime &&
      selectedChannels.length > 0 &&
      campaignState.picture.length > 0
    ) {
      setIsAbleToSubmit(true);
    }
  }, [campaignState]);

  useEffect(() => {
    if (state.user.role.name !== 'Customer') Router.push('/404');
    else {
      let mounted = true;
      //fetch Categories
      const fetchCategory = async () => {
        const url = API_URL + '/categories';
        try {
          const get_resolve = await axios.get(url, {
            cancelToken: signal.token,
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
            setCategories({ categories: get_resolve.data });
            console.log(categories);
          }
        } catch (error) {
          if (axios.isCancel(error) && error.message !== undefined) {
            console.log('Error: ', error.message);
          } else {
            console.log(error);
          }
        }
      };

      //fetch Influencers

      const fetchInfluencers = async () => {
        const url = API_URL + '/users?_where[role.name]=Influencer';
        try {
          const get_resolve = await axios.get(url, {
            cancelToken: signal.token,
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
            setInfluencers({ influencers: get_resolve.data });
            console.log('asdasdasdasdasdas', get_resolve.data);
          }
        } catch (error) {
          if (axios.isCancel(error) && error.message !== undefined) {
            console.log('Error: ', error.message);
          } else {
            console.log(error);
          }
        }
      };
      fetchCategory();
      fetchInfluencers();
      return function cleanup() {
        mounted = false;
        signal.cancel();
      };
    }
  }, [state]);

  return (
    <div>
      <div className='wrapper'>
        <div className='main'>
          <Container>
            <Card>
              <CardHeader>
                <h3 className='title'>Create Campaign</h3>
              </CardHeader>
              <CardBody>
                <Form className='form'>
                  <FormGroup>
                    <Label for='title'>Title</Label>
                    <Input
                      type='text'
                      id='title'
                      name='title'
                      onChange={handleCampaignChange}
                      value={campaignState.title}
                      placeholder='Title'
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='content'>Content</Label>
                    <Editor
                      apiKey='rra7fcsvr0q6e0fws0mvcj75edqjwjwz9glbrvv24pljw2yp'
                      id='content'
                      placeholder='Content...'
                      onEditorChange={handleContentChange}
                      value={campaignState.content}
                      required
                    />
                  </FormGroup>
                  <div className='form-row'>
                    <FormGroup className='col-md-4'>
                      <Label for='startDate'>Select start date</Label>
                      <Datetime
                        onChange={handleStartDateChange}
                        value={campaignState.open_datetime}
                        required
                        isValidDate={validStartDate}
                      />
                    </FormGroup>
                    <FormGroup className='col-md-4'>
                      <Label for='endDate'>Select end date</Label>
                      <Datetime
                        onChange={handleEndDateChange}
                        value={campaignState.close_datetime}
                        required
                        isValidDate={valid}
                      />
                    </FormGroup>
                  </div>
                  <div className='form-row'>
                    <FormGroup className='col-md-3'>
                      <Label for='channel'>Select by?...</Label>
                      <br />
                      <UncontrolledDropdown group disabled={isMethodDisabled}>
                        <DropdownToggle
                          caret
                          color='secondary'
                          data-toggle='dropdown'
                          className='mydropdown'
                        >
                          {typeOfSelection === 'category'
                            ? 'Category'
                            : 'Influencer'}
                        </DropdownToggle>
                        <DropdownMenu className='dropdown-menu'>
                          <DropdownItem
                            onClick={(event) => {
                              event.preventDefault();
                              handleSelectType('category');
                            }}
                          >
                            Category
                          </DropdownItem>
                          <DropdownItem
                            onClick={(event) => {
                              event.preventDefault();
                              handleSelectType('influencer');
                            }}
                          >
                            Influencer
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </FormGroup>
                    <RenderCategoryOrInfluencerDropdown />
                  </div>
                  <div className='form-row'>
                    <RenderChips />
                  </div>
                </Form>
                <br />
                <div className='FileUpload'>
                  <form onSubmit={handleImageSubmit}>
                    <Label for='picture'>Select picture...</Label>
                    <br />
                    <input type='file' onChange={handleImageChange} />
                    <Button>Upload</Button>
                    {picture.loading ? <CircularProgress /> : null}
                    {picture.submmited ? <CheckIcon /> : <p></p>}
                  </form>
                </div>
                <div className='form-button'>
                  <Button className='btn-neutral' color='primary'>
                    Cancel
                  </Button>
                  <Button
                    color='primary'
                    disabled={!isAbleToSubmit}
                    onClick={handleCampaignSubmit}
                  >
                    Create
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Create;
