import React, { useEffect, useState } from 'react';
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
import { Editor } from '@tinymce/tinymce-react';
import { CircularProgress } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import CheckIcon from '@material-ui/icons/Check';

import { CREATE_CHANNEL } from '../graphql/mutations/channel/createChannel';
import { REQUEST_GET_ALL_CATEGORIES } from '../graphql/query/category/getCategory';
import { useMutation, useQuery } from 'react-apollo';

const { API_URL } = process.env;

const Create = () => {
  const { state } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const signal = axios.CancelToken.source();
  useEffect(() => {
    if (state.user.role.name !== 'Influencer') Router.push('/404');
  }, [state]);
  const [channelState, setChannel] = useState({
    name: '',
    description: '',
    address: '',
    website: '',
    user: state.user.id,
    category: null,
    employeeConfirm: null,
    adminConfirm: null,
    phone: '',
    price: 0,
    status: null,
    avatar: null,
  });
  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);

  const [categories, setCategories] = useState({
    categories: [],
  });

  const [tempData, setTempData] = useState({
    categoryId: '',
    categoryName: '',
  });

  const [avatar, setAvatar] = useState({
    file: null,
    loading: false,
    submmited: false,
  });

  const handleAvatarChange = (event) => {
    setAvatar({
      file: event.target.files[0],
      submmited: false,
    });
  };

  const handleChannelChange = (event) => {
    const { name, value } = event.target;
    setChannel((previousState) => {
      return { ...previousState, [name]: value };
    });
  };

  const handleCategoryChange = (id, name) => {
    setChannel((previousState) => {
      return { ...previousState, category: id };
    });
    setTempData({
      categoryId: id,
      categoryName: name,
    });
  };

  const handleDescriptionChange = (content) => {
    setChannel((previousState) => {
      return { ...previousState, description: content };
    });
  };
  console.log(channelState);
  const [requestCreateChannelMutation] = useMutation(CREATE_CHANNEL);
  const handleChannelSubmit = async () => {
    try {
      requestCreateChannelMutation({
        variables: {
          name: channelState.name,
          description: channelState.description,
          address: channelState.address,
          website: channelState.website,
          phone: channelState.phone,
          avatar: channelState.avatar,
          price: channelState.price,
          category: channelState.category,
          user: state.user.id,
        },
      });
      Router.push('/dashboard');
      return enqueueSnackbar(
        'Tạo channel thành công! Channel của bạn đang được xét duyệt!',
        {
          variant: 'success',
        }
      );
    } catch (error) {
      return enqueueSnackbar(errorLog(error.message), { variant: 'error' });
    }
  };

  const handleAvatarSubmit = async (event) => {
    event.preventDefault();
    setAvatar((previousState) => {
      return {
        ...previousState,
        loading: true,
      };
    });
    const data = new FormData();
    data.append('files', avatar.file);
    const upload_resolve = await axios({
      method: 'POST',
      headers: {
        Authorization: `Bearer ${state.jwt}`,
      },
      url: `${API_URL}/upload`,
      data,
    });
    setAvatar((previousState) => {
      return {
        ...previousState,
        loading: false,
        submmited: true,
      };
    });
    setChannel((previousState) => {
      return {
        ...previousState,
        avatar: upload_resolve.data[0].id,
      };
    });
  };

  useEffect(() => {
    if (
      channelState.name !== '' &&
      channelState.description !== '' &&
      channelState.website.match(
        new RegExp(
          /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
        )
      ) &&
      channelState.phone.match(
        new RegExp(/(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)
      ) &&
      channelState.price >= 50000 &&
      channelState.category !== '' &&
      channelState.avatar !== null
    ) {
      setIsAbleToSubmit(true);
    }
  }, [channelState]);

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
          {channelState.category === null
            ? 'Chọn Danh mục...'
            : tempData.categoryName}
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
  return (
    <div>
      <div className='wrapper'>
        <div className='main'>
          <Container>
            <Card>
              <CardHeader>
                <h3 className='title'>Tạo channel</h3>
              </CardHeader>
              <CardBody>
                <Form className='form'>
                  <FormGroup>
                    <Label for='name'>Tên Channel</Label>
                    <Input
                      type='text'
                      id='name'
                      name='name'
                      onChange={handleChannelChange}
                      value={channelState.name}
                      placeholder='Tên Channel'
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='content'>Mô tả chung</Label>
                    <Editor
                      apiKey='awf8d12nkj02oekbnk7t8xx283a5kexhscdfvpj9sd8h22ox'
                      id='content'
                      placeholder='Nội dung...'
                      onEditorChange={handleDescriptionChange}
                      value={channelState.description}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='channel'>Chọn Danh mục</Label>
                    <br />
                    <UncontrolledDropdown group>
                      <FetchCategories />
                    </UncontrolledDropdown>
                  </FormGroup>
                  <FormGroup>
                    <Label for='website'>Website</Label>
                    <Input
                      type='text'
                      id='website'
                      name='website'
                      onChange={handleChannelChange}
                      value={channelState.website}
                      placeholder='Đường dẫn website'
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='website'>Số điện thoại</Label>
                    <Input
                      type='number'
                      id='phone'
                      name='phone'
                      onChange={handleChannelChange}
                      value={channelState.phone}
                      placeholder='Số điện thoại'
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='website'>Mức giá</Label>
                    <Input
                      type='number'
                      id='price'
                      name='price'
                      onChange={handleChannelChange}
                      value={channelState.price}
                      placeholder='Mức giá'
                      required
                    />
                  </FormGroup>
                </Form>
                <br />
                <div className='FileUpload'>
                  <form onSubmit={handleAvatarSubmit}>
                    <Label for='picture'>Chọn ảnh...</Label>
                    <br />
                    <input type='file' onChange={handleAvatarChange} />
                    <Button>Tải lên</Button>
                    {avatar.loading ? <CircularProgress /> : null}
                    {avatar.submmited ? <CheckIcon /> : <p></p>}
                  </form>
                </div>
                <div className='form-button'>
                  <Button className='btn-neutral' color='primary'>
                    Hủy
                  </Button>
                  <Button
                    color='primary'
                    disabled={!isAbleToSubmit}
                    onClick={handleChannelSubmit}
                  >
                    Tạo
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
