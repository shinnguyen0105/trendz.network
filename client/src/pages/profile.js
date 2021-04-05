import React, { useEffect, useState, useContext } from 'react';
import Datetime from 'react-datetime';
import classnames from 'classnames';
import { useAuth } from '../contexts/userContext';
import Router, { withRouter } from 'next/router';
import PerfectScrollbar from 'perfect-scrollbar';
import axios from 'axios';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Label,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  NavItem,
  NavLink,
  Nav,
  Spinner,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
//import { raw } from 'file-loader';

let ps = null;
const { API_URL } = process.env;

const Profile = () => {
  const { state } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [tabState, setTab] = useState({
    tabs: 1,
  });
  const [isLoading, setLoading] = useState(true);

  const [user, setUser] = useState({
    name: '',
    address: '',
    gender: '',
    phoneNumber: '',
    birthDay: '',
  });

  const signal = axios.CancelToken.source();

  const [avatar, setAvatar] = useState({ preview: '', raw: '' });

  const [userAvatar, setUserAvatar] = useState({
    avatar: {
      id: null,
    },
  });

  const [userUpdate, setUserUpdate] = useState(user);

  const [date] = useState(Datetime.moment().subtract(15, 'year'));
  var validBirthDay = function (current) {
    return current.isBefore(date);
  };

  const [avatarModal, setAvatarModal] = useState(false);

  const toggleAvatarModal = () => {
    setAvatarModal(!avatarModal);
  };

  const handleAvatarChange = (e) => {
    if (e.target.files.length) {
      setAvatar({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleBirthdayChange = (event) => {
    if (event._d !== undefined) {
      const value = moment(event._d).add(1, 'hour').toISOString().substr(0, 10);
      setUserUpdate((previousState) => {
        return {
          ...previousState,
          birthDay: value,
        };
      });
    } else return;
  };

  const handleUserChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setUserUpdate((previousState) => {
      return {
        ...previousState,
        [name]: value,
      };
    });
  };

  const updateAvatar = async () => {
    const data = new FormData();
    data.append('files', avatar.raw);
    const upload_resolve = await axios({
      method: 'POST',
      headers: {
        Authorization: `Bearer ${state.jwt}`,
      },
      url: `${API_URL}/upload`,
      data,
    });
    setUserAvatar((previousState) => {
      return {
        ...previousState,
        avatar: {
          id: upload_resolve.data[0].id,
        },
      };
    });
  };

  const updateUserAvatar = async () => {
    try {
      await axios({
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${state.jwt}`,
        },
        url: `${API_URL}/users/${state.user.id}`,
        data: userAvatar,
      });
    } catch (e) {
      console.log(e);
    }
    return;
  };

  const updateUser = async () => {
    setUser((previousState) => {
      return {
        ...previousState,
        name: userUpdate.name,
        address: userUpdate.address,
        gender: userUpdate.gender,
        phoneNumber: userUpdate.phoneNumber,
        birthDay: userUpdate.birthDay,
      };
    });
    const upload_resolve = await axios({
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${state.jwt}`,
      },
      url: `${API_URL}/users/${state.user.id}`,
      data: userUpdate,
    });
    enqueueSnackbar('Cập nhật thông tin thành công!', { variant: 'success' });
  };

  const renderSetGender = () => {
    switch (userUpdate.gender) {
      case '':
        return 'Giới tính...';
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      case 'other':
        return 'Khác';
      default:
        return 'Giới tính...';
    }
  };

  const renderGender = () => {
    switch (user.gender) {
      case '':
        return '(Vui lòng cập nhật thông tin)';
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      case 'other':
        return 'Khác';
      default:
        return '(Vui lòng cập nhật thông tin)';
    }
  };

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setTab((previousState) => {
      return {
        ...previousState,
        [stateName]: index,
      };
    });
  };

  useEffect(() => {
    if (userAvatar.avatar.id !== null) {
      updateUserAvatar();
      enqueueSnackbar('Cập nhật ảnh đại diện thành công!', {
        variant: 'success',
      });
    }
  }, [userAvatar]);

  useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      document.documentElement.className += ' perfect-scrollbar-on';
      document.documentElement.classList.remove('perfect-scrollbar-off');
      let tables = document.querySelectorAll('.table-responsive');
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.body.classList.toggle('profile-page');
    return () => {
      if (navigator.platform.indexOf('Win') > 1) {
        ps.destroy();
        document.documentElement.className += ' perfect-scrollbar-off';
        document.documentElement.classList.remove('perfect-scrollbar-on');
      }
      document.body.classList.toggle('profile-page');
    };
  });

  useEffect(() => {
    if (state.jwt === '') Router.push('/login');
    else {
      let mounted = true;
      const url = `${API_URL}/users/${state.user.id}`;
      const fetchUser = async () => {
        try {
          const get_resolve = await axios.get(url, {
            cancelToken: signal.token,
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
            if (
              get_resolve.data.name !== undefined &&
              get_resolve.data.address !== undefined &&
              get_resolve.data.phoneNumber !== undefined &&
              get_resolve.data.gender !== undefined &&
              get_resolve.data.birthDay !== undefined
            ) {
              setUser({
                name: get_resolve.data.name,
                address: get_resolve.data.address,
                phoneNumber: get_resolve.data.phoneNumber,
                gender: get_resolve.data.gender,
                birthDay: get_resolve.data.birthDay,
              });
            }
            console.log('user ne: ', get_resolve.data.avatar);
            if (get_resolve.data.avatar !== null) {
              setAvatar({
                preview:
                  API_URL + get_resolve.data.avatar.formats.thumbnail.url,
                raw: get_resolve.data.avatar.url,
              });
            }
          }
        } catch (error) {
          if (axios.isCancel(error) && error.message !== undefined) {
            console.log('Error: ', error.message);
          } else {
            throw error;
          }
        }
      };
      fetchUser().then(setLoading(false));

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
            {!isLoading ? (
              <Card className='card-coin card-plain'>
                <CardHeader>
                  <img
                    className='img-center img-fluid rounded-circle'
                    src={
                      avatar.preview !== '' ? avatar.preview : '/256x186.svg'
                    }
                  />
                  <h3 className='title'>{state.user.username}</h3>
                  <Button color='primary' onClick={toggleAvatarModal}>
                    Cập nhật ảnh đại diện
                  </Button>
                  <Modal isOpen={avatarModal} toggle={toggleAvatarModal}>
                    <div className='modal-header'>
                      <h4 className='modal-title' id='avatarModal'>
                        <strong>Cập nhật ảnh đại diện</strong>
                      </h4>
                      <button
                        type='button'
                        className='close'
                        data-dismiss='modal'
                        aria-hidden='true'
                        onClick={toggleAvatarModal}
                      >
                        <i className='tim-icons icon-simple-remove' />
                      </button>
                    </div>
                    <ModalBody>
                      <label htmlFor='upload-button'>
                        {avatar.preview ? (
                          <img
                            src={avatar.preview}
                            alt='dummy'
                            width='300'
                            height='300'
                          />
                        ) : (
                          <>
                            <input
                              type='file'
                              onChange={handleAvatarChange}
                              id='upload-button'
                            />
                          </>
                        )}
                      </label>
                      <input
                        type='file'
                        id='upload-button'
                        onChange={handleAvatarChange}
                      />
                      <br />
                    </ModalBody>
                    <ModalFooter>
                      <Button color='secondary' onClick={toggleAvatarModal}>
                        Hủy
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => {
                          updateAvatar();
                          toggleAvatarModal();
                        }}
                      >
                        Lưu
                      </Button>
                    </ModalFooter>
                  </Modal>
                </CardHeader>
                <CardBody>
                  <Nav className='nav-tabs-primary justify-content-center' tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: tabState.tabs === 1 || tabState.tabs === 3,
                        })}
                        onClick={(event) => toggleTabs(event, 'tabs', 1)}
                      >
                        Hồ sơ
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: tabState.tabs === 2 || tabState.tabs === 4,
                        })}
                        onClick={(event) => toggleTabs(event, 'tabs', 2)}
                      >
                        Tài khoản
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent
                    className='tab-subcategories'
                    activeTab={'tab' + tabState.tabs}
                  >
                    <TabPane tabId='tab1'>
                      <Row>
                        <Label sm='5'>Tên</Label>
                        <Col sm='6'>
                          <h4>
                            {user.name === ''
                              ? '(Vui lòng cập nhật thông tin)'
                              : user.name}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'>Ngày sinh</Label>
                        <Col sm='6'>
                          <h4>
                            {user.birthDay === ''
                              ? '(Vui lòng cập nhật thông tin)'
                              : new Date(user.birthDay).toLocaleDateString(
                                  'en-GB'
                                )}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'>Số điện thoại</Label>
                        <Col sm='6'>
                          <h4>
                            {user.phoneNumber === ''
                              ? '(Vui lòng cập nhật thông tin)'
                              : user.phoneNumber}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'>Giới tính</Label>
                        <Col sm='6'>
                          <h4>{renderGender()}</h4>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'>Địa chỉ</Label>
                        <Col sm='6'>
                          <h4>
                            {user.address === ''
                              ? '(Vui lòng cập nhật thông tin)'
                              : user.address}
                          </h4>
                        </Col>
                      </Row>
                      <Button
                        onClick={(event) => {
                          setUserUpdate(user);
                          toggleTabs(event, 'tabs', 3);
                        }}
                        className='btn-simple btn-icon btn-round float-right'
                        color='warning'
                      >
                        <i className='tim-icons icon-pencil' />
                      </Button>
                    </TabPane>
                    <TabPane tabId='tab2'>
                      <Row>
                        <Label sm='5'>Email</Label>
                        <Col sm='6'>
                          <h4>{state.user.email}</h4>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'>Mật khẩu</Label>
                        <Col sm='6'>
                          <Button
                            className={classnames({
                              active: tabState.tabs === 4,
                            })}
                            onClick={(event) => toggleTabs(event, 'tabs', 4)}
                          >
                            Thay đổi mật khẩu
                          </Button>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId='tab3'>
                      <Row>
                        <Label sm='5'>Tên</Label>
                        <Col sm='4'>
                          <FormGroup>
                            <Input
                              name='name'
                              value={userUpdate.name}
                              type='text'
                              onChange={handleUserChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'>Ngày sinh</Label>
                        <Col sm='4'>
                          <FormGroup>
                            <Datetime
                              onChange={handleBirthdayChange}
                              value={
                                userUpdate.birthDay !== ''
                                  ? new Date(
                                      userUpdate.birthDay
                                    ).toLocaleDateString('en-GB')
                                  : ''
                              }
                              required
                              isValidDate={validBirthDay}
                              timeFormat={false}
                              initialViewDate={
                                user.birthDay !== ''
                                  ? new Date(user.birthDay)
                                  : new Date('1-1-1995')
                              }
                              locale='en-GB'
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'>Số điện thoại</Label>
                        <Col sm='4'>
                          <FormGroup>
                            <Input
                              name='phoneNumber'
                              value={userUpdate.phoneNumber}
                              type='text'
                              onChange={handleUserChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'>Giới tính</Label>
                        <Col sm='4'>
                          <FormGroup>
                            <UncontrolledDropdown group>
                              <DropdownToggle
                                caret
                                data-toggle='dropdown'
                                className='mydropdown'
                              >
                                {renderSetGender()}
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  name='gender'
                                  value='male'
                                  onClick={handleUserChange}
                                >
                                  Nam
                                </DropdownItem>
                                <DropdownItem
                                  name='gender'
                                  value='female'
                                  onClick={handleUserChange}
                                >
                                  Nữ
                                </DropdownItem>
                                <DropdownItem
                                  name='gender'
                                  value='other'
                                  onClick={handleUserChange}
                                >
                                  Khác
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'>Địa chỉ</Label>
                        <Col sm='4'>
                          <FormGroup>
                            <Input
                              name='address'
                              value={userUpdate.address}
                              type='text'
                              onChange={handleUserChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'></Label>
                        <Button
                          onClick={(event) => {
                            setUserUpdate(user);
                            toggleTabs(event, 'tabs', 1);
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          color='primary'
                          onClick={(event) => {
                            updateUser();
                            toggleTabs(event, 'tabs', 1);
                          }}
                        >
                          Lưu
                        </Button>
                      </Row>
                    </TabPane>
                    <TabPane tabId='tab4'>
                      <Row>
                        <Label sm='5'>Mật khẩu mới</Label>
                        <Col sm='4'>
                          <FormGroup>
                            <Input type='password' />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'>Nhập lại mật khẩu mới</Label>
                        <Col sm='4'>
                          <FormGroup>
                            <Input type='password' />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm='5'></Label>
                        <Button
                          onClick={(event) => toggleTabs(event, 'tabs', 2)}
                        >
                          Hủy
                        </Button>
                        <Button color='primary' type='submit'>
                          Lưu
                        </Button>
                      </Row>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            ) : (
              <Spinner />
            )}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Profile);
