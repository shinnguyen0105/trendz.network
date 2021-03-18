import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  Row,
  Col,
  NavLink,
  UncontrolledCollapse,
} from 'reactstrap';

import { useAuth } from '../../../contexts/userContext';

import Image from 'next/image';
import Router from 'next/router';
import Link from 'next/link';

/* TYPES */
export const LOGOUT = 'LOGOUT';

const ButtonParent = React.forwardRef(({ children, href, onClick }, ref) => (
  <p ref={ref} href={href} onClick={onClick}>
    {children}
  </p>
));

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useAuth();
  const [isLoggedIn, setLoggedIn] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    dispatch({ type: LOGOUT });

    Router.push('/login');
    location.reload();
  };
  const renderUnAuthenticateHeader = (
    <Navbar
      className='navbar-main navbar-transparent navbar-light headroom'
      expand='lg'
      id='navbar-main'
    >
      <Container>
        <NavbarBrand className='mr-lg-5'>
          <Link href='/'>
            <Image
              alt='...'
              className='mt-1'
              width='100'
              height='30'
              src='/argon-react-white.png'
            />
          </Link>
        </NavbarBrand>
        <button className='navbar-toggler' id='navbar_global' onClick={toggle}>
          <span className='navbar-toggler-icon' />
        </button>
        <Collapse toggler='#navbar_global' navbar isOpen={isOpen}>
          <div className='navbar-collapse-header'>
            <Row>
              <Col className='collapse-brand' xs='6'>
                <Link href='/' onClick={toggle}>
                  <Image
                    alt='...'
                    className='mt-1'
                    width='100'
                    height='30'
                    src='/argon-react.png'
                  />
                </Link>
              </Col>
              <Col className='collapse-close' xs='6'>
                <button
                  className='navbar-toggler'
                  id='navbar_global'
                  onClick={toggle}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Nav>
            <Row>
              <Col className='collapse-brand' xs='12'>
                <NavLink
                  className='nav-pills d-lg-none d-xl-none'
                  onClick={toggle}
                >
                  <Link href='/login'>
                    <ButtonParent>Sign in</ButtonParent>
                  </Link>
                </NavLink>
              </Col>
              <Col className='collapse-brand' xs='12'>
                <NavLink
                  className='nav-pills d-lg-none d-xl-none'
                  onClick={toggle}
                >
                  <Link href='/register'>
                    <ButtonParent>Sign up</ButtonParent>
                  </Link>
                </NavLink>
              </Col>
            </Row>
          </Nav>
          <Nav className='align-items-lg-center ml-lg-auto' navbar>
            <NavItem className='d-none d-lg-block ml-lg-4'>
              <Link href='/login'>
                <Button
                  className='btn-icon btn-3 ml-1'
                  color='primary'
                  type='button'
                >
                  <span className='btn-inner--icon mr-1'>
                    <i className='fa fa-cloud-download mr-1' />
                  </span>
                  <span className='nav-link-inner--text ml-1'>Sign In</span>
                </Button>
              </Link>
            </NavItem>
            <NavItem className='d-none d-lg-block ml-lg-4'>
              <Link href='/register'>
                <Button
                  className='btn-icon btn-3 ml-1'
                  color='info'
                  type='button'
                >
                  <span className='btn-inner--icon'>
                    <i className='fa fa-cloud-download mr-1' />
                  </span>
                  <span className='nav-link-inner--text ml-1'>Sign Up</span>
                </Button>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );

  const renderAuthenticateHeader = (
    <Navbar
      className='navbar-main navbar-transparent navbar-light headroom'
      expand='lg'
      id='navbar-main'
    >
      <Container>
        <NavbarBrand className='mr-lg-5'>
          <Link href='/dashboard'>
            <Image
              alt='...'
              className='mt-1'
              width='100'
              height='30'
              src='/argon-react-white.png'
            />
          </Link>
        </NavbarBrand>
        <button className='navbar-toggler' id='navbar_global'>
          <span className='navbar-toggler-icon' />
        </button>
        <Collapse toggler='#navbar_global' isOpen={isOpen} navbar>
          <div className='navbar-collapse-header'>
            <Row>
              <Col className='collapse-brand' xs='6'>
                <Link href='/dashboard'>
                  <Image
                    alt='...'
                    className='mt-1'
                    width='100'
                    height='30'
                    src='/argon-react.png'
                  />
                </Link>
              </Col>
              <Col className='collapse-close' xs='6'>
                <button
                  className='navbar-toggler'
                  id='navbar_global'
                  onClick={toggle}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Nav>
            <Row>
              <Col className='collapse-brand' xs='12'>
                <NavLink
                  className='nav-pills d-lg-none d-xl-none'
                  onClick={toggle}
                >
                  <Link href='/profile'>
                    <ButtonParent>Profile</ButtonParent>
                  </Link>
                </NavLink>
              </Col>
              <Col className='collapse-brand' xs='12'>
                <NavLink
                  className='nav-pills d-lg-none d-xl-none'
                  onClick={toggle}
                >
                  <Link href='/'>
                    <ButtonParent onClick={handleLogout}>Logout</ButtonParent>
                  </Link>
                </NavLink>
              </Col>
            </Row>
          </Nav>
          <Nav className='align-items-lg-center ml-lg-auto' navbar>
            <NavItem className='d-none d-lg-block ml-lg-4'>
              <Link href='/profile'>
                <Button
                  className='btn-neutral btn-icon'
                  color='default'
                  target='_blank'
                >
                  <span className='btn-inner--icon'>
                    <i className='fa fa-cloud-download mr-2' />
                  </span>
                  <span className='nav-link-inner--text ml-1'>Profile</span>
                </Button>
              </Link>
            </NavItem>
            <NavItem className='d-none d-lg-block ml-lg-4'>
              <Link href='/'>
                <Button
                  className='btn-neutral btn-icon'
                  color='default'
                  target='_blank'
                  onClick={handleLogout}
                >
                  <span className='btn-inner--icon'>
                    <i className='fa fa-cloud-download mr-2' />
                  </span>
                  <span className='nav-link-inner--text ml-1'>Logout</span>
                </Button>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );

  useEffect(() => {
    if (state.jwt !== '') {
      setLoggedIn(true);
    }
  }, [state.jwt]);

  return (
    <>
      <header className='header-global'>
        {isLoggedIn ? renderAuthenticateHeader : renderUnAuthenticateHeader}
      </header>
    </>
  );
}

export default Header;
