import React from 'react';
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

function Footer() {
  return (
    <footer className=' footer'>
      <Container>
        <Row className=' align-items-center justify-content-md-between'>
          <Col md='6'>
            <div className='copyright'>
              © {new Date().getFullYear()}{' '}
              <a href='/' target='_blank'>
                Trendz Network
              </a>
              .
            </div>
          </Col>
          <Col md='6'>
            <Nav className=' nav-footer justify-content-end'>
              <NavItem>
                <NavLink href='/' target='_blank'>
                  About Us
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href='https://github.com/shinnguyen0105/trendz.network'
                  target='_blank'
                >
                  Github
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
