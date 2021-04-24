import React from 'react';

import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faFacebook,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from 'reactstrap';
const TestButton = React.forwardRef(({ children, href, onClick }, ref) => (
  <p ref={ref} href={href} onClick={onClick}>
    {children}
  </p>
));
function Footer() {
  return (
    <footer className='footer'>
      <Container>
        <Row>
          <Col md='3'>
            <h2 className='title'>Trendz•Network</h2>
          </Col>
          <Col md='3'>
            <Nav>
              <NavItem>
                <NavLink>
                  <Link href='/'>
                    <TestButton>HOME</TestButton>
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link href='/register'>
                    <TestButton>REGISTER</TestButton>
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link href='/login'>
                    <TestButton>LOGIN</TestButton>
                  </Link>
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col md='3'>
            <Nav>
              <NavItem>
                <NavLink>
                  <Link href='/privacypolicies'>
                    <TestButton>Privacy Policy</TestButton>
                  </Link>
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
