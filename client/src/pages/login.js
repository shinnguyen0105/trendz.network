import React, { useEffect, useState, useContext } from 'react';
import { withRouter } from 'next/router';

import { UserContext } from '../contexts/userContext';
import { useSnackbar } from 'notistack';
import Link from 'next/link';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from 'reactstrap';

import Image from 'next/image';
import Router from 'next/router';

import { isEmpty } from 'lodash';
import { passwordCheck } from '../utils/functions/regEx/index';

import { REQUEST_LOGIN } from '../graphql/mutations/authentication/login';
import { useMutation } from 'react-apollo';

export const LOGIN = 'LOGIN';

const { API_URL } = process.env.API_URL;
const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [accountValues, setAccountValues] = useState({
    identifier: '',
    password: '',
  });

  // const [pointer, setPointer] = useState({
  //   squares1to6: '',
  //   squares7and8: '',
  // });

  const [focus, setFocus] = useState({
    emailFocus: false,
    passwordFocus: false,
  });
  // const followCursor = (event) => {
  //   let posX = event.clientX - window.innerWidth / 2;
  //   let posY = event.clientY - window.innerWidth / 6;

  //   setPointer((previousState) => {
  //     return {
  //       ...previousState,
  //       squares1to6:
  //         'perspective(500px) rotateY(' +
  //         posX * 0.05 +
  //         'deg) rotateX(' +
  //         posY * -0.05 +
  //         'deg)',
  //       squares7and8:
  //         'perspective(500px) rotateY(' +
  //         posX * 0.02 +
  //         'deg) rotateX(' +
  //         posY * -0.02 +
  //         'deg)',
  //     };
  //   });
  // };

  const [requestLoginMutation, { loading: requestLoginLoading }] = useMutation(
    REQUEST_LOGIN,
    {
      update(proxy, { data: userData }) {
        dispatch({ type: LOGIN, payload: userData.login });
      },
      variables: accountValues,
    }
  );

  const handleAccountChange = (event) => {
    const { name, value } = event.target;
    setAccountValues((previousState) => {
      return { ...previousState, [name]: value };
    });
  };

  const requestLogin = async () => {
    if (isEmpty(accountValues.identifier) && isEmpty(accountValues.password)) {
      enqueueSnackbar('Không được bỏ trống cả hai trường', {
        variant: 'error',
      });
    }
    if (!passwordCheck.test(accountValues.password)) {
      enqueueSnackbar(
        'Mật khẩu phải có tối thiểu 8 ký tự (Bao gồm: >=1 kí tự đặc biệt, >=1 chữ số, >=1 chữ cái in hoa)',
        { variant: 'error' }
      );
    } else
      try {
        await requestLoginMutation();
        enqueueSnackbar('Đăng nhập thành công!', { variant: 'success' });
        Router.push('/dashboard');
      } catch (error) {
        console.log(error);
        return enqueueSnackbar(
          'Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại!',
          { variant: 'error' }
        );
      }
  };

  useEffect(() => {
    if (state.jwt === '') return;
    Router.push('/login');
  }, [state]);
  return (
    <main>
      <section className='section section-shaped section-lg'>
        <div className='shape shape-style-1 bg-gradient-default'>
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <Container className='pt-lg-7'>
          <Row className='justify-content-center'>
            <Col lg='5'>
              <Card className='bg-secondary shadow border-0'>
                <CardHeader className='bg-white pb-5'>
                  <div className='text-muted text-center mb-3'>
                    <small>Sign in with</small>
                  </div>
                  <div className='btn-wrapper text-center'>
                    <Button
                      className='btn-neutral btn-icon'
                      color='default'
                      href='#pablo'
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className='btn-inner--icon mr-1 pb-2'>
                        <Image
                          alt='...'
                          className='mt-1'
                          width='20'
                          height='20'
                          src='/github.svg'
                        />
                      </span>
                      <span className='btn-inner--text'>Github</span>
                    </Button>
                    <Button
                      className='btn-neutral btn-icon ml-1'
                      color='default'
                      href='#pablo'
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className='btn-inner--icon mr-1 pb-2'>
                        <Image
                          alt='...'
                          className='mt-1'
                          width='20'
                          height='20'
                          src='/google.svg'
                        />
                      </span>
                      <span className='btn-inner--text'>Google</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className='px-lg-5 py-lg-5'>
                  <div className='text-center text-muted mb-4'>
                    <small>Or sign in with credentials</small>
                  </div>
                  <Form role='form'>
                    <FormGroup className='mb-3'>
                      <InputGroup className='input-group-alternative'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='ni ni-email-83' />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder='Tên đăng nhập'
                          type='text'
                          required
                          id='identifier'
                          name='identifier'
                          onChange={handleAccountChange}
                          value={accountValues.identifier}
                        />
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <InputGroup className='input-group-alternative'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='ni ni-lock-circle-open' />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder='Mật khẩu'
                          type='password'
                          required
                          id='password'
                          name='password'
                          onChange={handleAccountChange}
                          value={accountValues.password}
                        />
                      </InputGroup>
                    </FormGroup>

                    <div className='custom-control custom-control-alternative custom-checkbox'>
                      <input
                        className='custom-control-input'
                        id=' customCheckLogin'
                        type='checkbox'
                      />
                      <label
                        className='custom-control-label'
                        htmlFor=' customCheckLogin'
                      >
                        <span>Remember me</span>
                      </label>
                    </div>
                    <div className='text-center'>
                      <Button
                        className='my-4'
                        color='primary'
                        type='button'
                        onClick={requestLogin}
                        disabled={requestLoginLoading}
                      >
                        Sign in
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
              <Row className='mt-3'>
                <Col xs='6'>
                  <a
                    className='text-light'
                    href='#pablo'
                    onClick={(e) => e.preventDefault()}
                  >
                    <small>Forgot password?</small>
                  </a>
                </Col>
                <Col className='text-right' xs='6'>
                  <Link href='/register'>
                    <a className='text-light' href='#pablo'>
                      <small>Create new account</small>
                    </a>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default withRouter(Login);
