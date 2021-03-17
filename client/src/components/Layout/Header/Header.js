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
} from 'reactstrap';

import { useAuth } from '../../../contexts/userContext';

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
  const { state, dispatch } = useAuth();
  const [isOpen, toggleIsOpen] = useState(false);
  const [navColor, setNavColor] = useState({
    color: 'navbar-transparent',
  });
  const [navCollapse, setNavCollapse] = useState({
    collapseOut: '',
  });
  const [isLoggedIn, setLoggedIn] = useState(false);
  const changeColor = useCallback(() => {
    if (
      document.documentElement.scrollTop > 99 ||
      document.body.scrollTop > 99
    ) {
      setNavColor((previousState) => {
        return {
          ...previousState,
          color: 'bg-navbar',
        };
      });
    } else if (
      document.documentElement.scrollTop < 100 ||
      document.body.scrollTop < 100
    ) {
      setNavColor((previousState) => {
        return {
          ...previousState,
          color: 'navbar-transparent',
        };
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', changeColor);
    return () => {
      window.removeEventListener('scroll', changeColor);
    };
  }, [changeColor]);

  const toggleCollapse = () => {
    document.documentElement.classList.toggle('nav-open');
    toggleIsOpen((isOpen) => !isOpen);
  };

  const onCollapseExiting = () => {
    setNavCollapse((previousState) => {
      return {
        ...previousState,
        collapseOut: 'collapsing-out',
      };
    });
  };
  const onCollapseExited = () => {
    setNavCollapse((previousState) => {
      return {
        ...previousState,
        collapseOut: '',
      };
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    dispatch({ type: LOGOUT });

    Router.push('/login');
    location.reload();
  };

  const renderUnloggedInButton = (
    <Nav className='align-items-lg-center ml-lg-auto' navbar>
      <NavItem>
        <Link href='/login'>
          <Button className='btn-1 ml-1' color='info' type='button'>
            <span className='btn-inner--icon'>
              <i className='fa fa-cloud-download mr-2' />
            </span>
            <span className='nav-link-inner--text ml-1'>Đăng Nhập</span>
          </Button>
        </Link>
      </NavItem>
      <NavItem>
        <Link href='/register'>
          <Button
            className='btn-1 btn-neutral ml-1'
            color='default'
            type='button'
          >
            Đăng ký
          </Button>
        </Link>
      </NavItem>
    </Nav>
  );

  const renderLoggedInButton = (
    <Nav navbar>
      <NavItem>
        <Link href='/profile'>
          <Button className='nav-link d-none d-lg-block' color='warning'>
            Hồ sơ
          </Button>
        </Link>
        <NavLink
          className='nav-pills d-lg-none d-xl-none'
          onClick={toggleCollapse}
        >
          <Link href='/profile'>
            <ButtonParent>Hồ sơ</ButtonParent>
          </Link>
        </NavLink>
      </NavItem>
      <NavItem>
        <Link href='/'>
          <Button
            className='nav-link d-none d-lg-block'
            color='default'
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </Link>

        <NavLink
          className='nav-pills d-lg-none d-xl-none'
          onClick={() => {
            toggleCollapse();
            handleLogout();
          }}
        >
          <Link href='/'>
            <ButtonParent>Đăng xuất</ButtonParent>
          </Link>
        </NavLink>
      </NavItem>
    </Nav>
  );

  const renderUnloggedBrand = (
    <Link href='/'>
      <ButtonParent>
        <span>TRENDZ • </span>
        NETWORK
      </ButtonParent>
    </Link>
  );

  const renderLoggedBrand = (
    <Link href='/dashboard'>
      <ButtonParent>
        <span>TRENDZ • </span>
        NETWORK
      </ButtonParent>
    </Link>
  );

  useEffect(() => {
    if (state.jwt !== '') {
      setLoggedIn(true);
    }
  }, [state.jwt]);

  return (
    <Navbar
      className={`fixed-top ${navColor.color}`}
      color-on-scroll='100'
      expand='lg'
    >
      <Container>
        <div className='navbar-translate'>
          <NavbarBrand id='navbar-brand'>
            {!isLoggedIn ? renderUnloggedBrand : renderLoggedBrand}
          </NavbarBrand>
          <button
            aria-expanded={isOpen}
            className='navbar-toggler navbar-toggler'
            onClick={toggleCollapse}
          >
            <span className='navbar-toggler-bar bar1' />
            <span className='navbar-toggler-bar bar2' />
            <span className='navbar-toggler-bar bar3' />
          </button>
        </div>
        <Collapse
          className={`justify-content-end ${navCollapse.collapseOut}`}
          navbar
          isOpen={isOpen}
          onExiting={onCollapseExiting}
          onExited={onCollapseExited}
        >
          <div className='navbar-collapse-header'>
            <Row>
              <Col className='collapse-brand' xs='6'></Col>
              <Col className='collapse-close text-right' xs='6'>
                <button
                  aria-expanded={isOpen}
                  className='navbar-toggler'
                  onClick={toggleCollapse}
                >
                  <i className='tim-icons icon-simple-remove' />
                </button>
              </Col>
            </Row>
          </div>
          {!isLoggedIn ? renderUnloggedInButton : renderLoggedInButton}
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
