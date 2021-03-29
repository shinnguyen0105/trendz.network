import React from 'react';

import classnames from 'classnames';
import {
  Card,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
} from 'reactstrap';

import Skeleton from '@material-ui/lab/Skeleton';
import ListChannel from '../../ListChannel';

const AdminDashboard = () => {
  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
  };
  function ListChannels() {
    const { loading, error, data } = useQuery(REQUEST_ALL_CHANNELS, {
      nextFetchPolicy: 'cache-and-network',
    });
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    let channels = data.channels;
    let onhold = channels.filter(
      (channel) =>
        channel.employeeConfirm == true && channel.adminConfirm == null
    );
    let approve = channels.filter(
      (channel) =>
        channel.employeeConfirm == true && channel.adminConfirm == true
    );
    let unapprove = channels.filter(
      (channel) =>
        channel.employeeConfirm == false && channel.adminConfirm == false
    );
    // console.log('onhold channel', onhold);
    // console.log('onhold channel', approve);
    // console.log('onhold channel', unapprove);

    return (
      <>
        <TabPane tabId='vertical1'>
          <ListChannel data={onhold} />
        </TabPane>
        <TabPane tabId='vertical2'>
          <ListChannel data={approve} />
        </TabPane>
        <TabPane tabId='vertical3'>
          <ListChannel data={unapprove} />
        </TabPane>
      </>
    );
  }

  return (
    <div className='wrapper'>
      <div className='main'>
        <Card>
          <CardBody>
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
                      Channel requests
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 2,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 2)}
                    >
                      Approved Channels
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 3,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 3)}
                    >
                      Unapproved Channels
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col>
                <TabContent activeTab={'vertical' + navState.vertical}>
                  <ListChannels />
                </TabContent>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;