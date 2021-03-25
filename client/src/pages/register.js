import React, { useEffect, useState, useContext } from 'react';
import classnames from 'classnames';
import { withRouter } from 'next/router';
import { UserContext } from '../contexts/userContext';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useSnackbar } from 'notistack';
import { isEmpty } from 'lodash';

import { passwordCheck } from '../utils/functions/regEx';

import { errorLog } from '../utils/functions/error-log-snackbar';

import { REQUEST_REGISTER } from '../graphql/mutations/authentication/register';
import { useMutation } from 'react-apollo';
import Router from 'next/router';

const Register = () => {
  const { state } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [accountValues, setAccountValues] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [reTypePassword, setReTypePassword] = useState({
    rePassword: '',
  });

  const [pointer, setPointer] = useState({
    squares1to6: '',
    squares7and8: '',
  });

  const [focus, setFocus] = useState({
    emailFocus: false,
    passwordFocus: false,
    usernameFocus: false,
    rePasswordFocus: false,
  });

  const followCursor = (event) => {
    let posX = event.clientX - window.innerWidth / 2;
    let posY = event.clientY - window.innerWidth / 6;

    setPointer((previousState) => {
      return {
        ...previousState,
        squares1to6:
          'perspective(500px) rotateY(' +
          posX * 0.05 +
          'deg) rotateX(' +
          posY * -0.05 +
          'deg)',
        squares7and8:
          'perspective(500px) rotateY(' +
          posX * 0.02 +
          'deg) rotateX(' +
          posY * -0.02 +
          'deg)',
      };
    });
  };

  const [
    requestRegisterMutation,
    { loading: requestRegisterLoading },
  ] = useMutation(REQUEST_REGISTER, {
    variables: accountValues,
  });

  const handleAccountChange = (event) => {
    const { name, value } = event.target;
    setAccountValues((previousState) => {
      return { ...previousState, [name]: value };
    });
  };

  const handleReTypePasswordChange = (event) => {
    const { name, value } = event.target;
    setReTypePassword((previousState) => {
      return { ...previousState, [name]: value };
    });
  };

  const requestRegister = async () => {
    if (
      isEmpty(accountValues.username) &&
      isEmpty(accountValues.password) &&
      isEmpty(accountValues.email)
    ) {
      enqueueSnackbar('Không được bỏ trống cả hai trường', {
        variant: 'error',
      });
    }
    if (!passwordCheck.test(accountValues.password)) {
      enqueueSnackbar(
        'Mật khẩu phải có tối thiểu 8 ký tự (Bao gồm: >=1 kí tự đặc biệt, >=1 chữ số, >=1 chữ cái in hoa)',
        { variant: 'error' }
      );
    }
    if (accountValues.password !== reTypePassword.rePassword) {
      enqueueSnackbar(
        'Mật khẩu và Nhập lại mật khẩu không trùng khớp! Vui lòng thử lại',
        { variant: 'success' }
      );
    } else
      try {
        await requestRegisterMutation();
        enqueueSnackbar('Đăng ký thành công! Vui lòng kiểm tra email của bạn', {
          variant: 'success',
        });
        return Router.push('/login');
      } catch (error) {
        return enqueueSnackbar(errorLog(error.message), { variant: 'error' });
      }
  };

  useEffect(() => {
    document.body.classList.toggle('register-page');
    document.documentElement.addEventListener('mousemove', followCursor);
    return () => {
      document.body.classList.toggle('register-page');
      document.documentElement.removeEventListener('mousemove', followCursor);
    };
  }, []);

  useEffect(() => {
    if (state.jwt === '') return;
    Router.push('/dashboard');
  }, [state]);
  return (
    <div>
      <div className='wrapper'>
        <div className='page-header'>
          <div className='page-header-image' />
          <div className='content'>
            <Container>
              <Row>
                <Col className='offset-lg-0 offset-md-3' lg='5' md='6'>
                  <div
                    className='square square-7'
                    id='square7'
                    style={{ transform: pointer.squares7and8 }}
                  />
                  <div
                    className='square square-8'
                    id='square8'
                    style={{ transform: pointer.squares7and8 }}
                  />
                  <Card className='card-register'>
                    <CardHeader>
                      <CardTitle tag='h4'>Đăng ký</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Form className='form'>
                        <InputGroup
                          className={classnames({
                            'input-group-focus': focus.usernameFocus,
                          })}
                        >
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='tim-icons'>
                                <FontAwesomeIcon icon={faUser} />
                              </i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Tên đăng nhập'
                            type='text'
                            required
                            onFocus={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  usernameFocus: true,
                                };
                              })
                            }
                            onBlur={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  usernameFocus: false,
                                };
                              })
                            }
                            id='username'
                            name='username'
                            onChange={handleAccountChange}
                            value={accountValues.username}
                          />
                        </InputGroup>
                        <InputGroup
                          className={classnames({
                            'input-group-focus': focus.emailFocus,
                          })}
                        >
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='tim-icons'>
                                <FontAwesomeIcon icon={faEnvelope} />
                              </i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Địa chỉ email'
                            type='text'
                            required
                            onFocus={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  emailFocus: true,
                                };
                              })
                            }
                            onBlur={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  emailFocus: false,
                                };
                              })
                            }
                            id='email'
                            name='email'
                            onChange={handleAccountChange}
                            value={accountValues.email}
                          />
                        </InputGroup>
                        <InputGroup
                          className={classnames({
                            'input-group-focus': focus.passwordFocus,
                          })}
                        >
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='tim-icons'>
                                <FontAwesomeIcon icon={faLock} />
                              </i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Mật khẩu'
                            type='password'
                            required
                            onFocus={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  passwordFocus: true,
                                };
                              })
                            }
                            onBlur={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  passwordFocus: false,
                                };
                              })
                            }
                            id='password'
                            name='password'
                            onChange={handleAccountChange}
                            value={accountValues.password}
                          />
                        </InputGroup>
                        <InputGroup
                          className={classnames({
                            'input-group-focus': focus.rePasswordFocus,
                          })}
                        >
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='tim-icons'>
                                <FontAwesomeIcon icon={faLock} />
                              </i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Nhập lại mật khẩu'
                            type='password'
                            required
                            onFocus={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  rePasswordFocus: true,
                                };
                              })
                            }
                            onBlur={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  rePasswordFocus: false,
                                };
                              })
                            }
                            id='rePassword'
                            name='rePassword'
                            onChange={handleReTypePasswordChange}
                            value={reTypePassword.rePassword}
                          />
                        </InputGroup>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button
                        className='btn-round'
                        color='warning'
                        size='lg'
                        onClick={requestRegister}
                        disabled={requestRegisterLoading}
                      >
                        Đăng ký
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
              <div className='register-bg' />
              <div
                className='square square-1'
                id='square1'
                style={{ transform: pointer.squares1to6 }}
              />
              <div
                className='square square-2'
                id='square2'
                style={{ transform: pointer.squares1to6 }}
              />
              <div
                className='square square-3'
                id='square3'
                style={{ transform: pointer.squares1to6 }}
              />
              <div
                className='square square-4'
                id='square4'
                style={{ transform: pointer.squares1to6 }}
              />
              <div
                className='square square-5'
                id='square5'
                style={{ transform: pointer.squares1to6 }}
              />
              <div
                className='square square-6'
                id='square6'
                style={{ transform: pointer.squares1to6 }}
              />
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Register);
