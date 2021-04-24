import React, { useState } from 'react';
import { useQuery } from 'react-apollo';

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

import { REQUEST_ALL_CHANNELS } from '../../../graphql/query/channel/getChannels';

import ListChannel from '../../ListChannel';
import StatisticsChart from '../../StatisticsChart';

const AdminDashboard = () => {
  const [navState, setNav] = useState({
    vertical: 1,
  });
  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
  };
  function ListChannels() {
    const { loading, error, data } = useQuery(REQUEST_ALL_CHANNELS);
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
        channel.employeeConfirm == true && channel.adminConfirm == false
    );
    // console.log('onhold channel', onhold);
    // console.log('onhold channel', approve);
    // console.log('onhold channel', unapprove);

    return (
      <>
        <TabPane tabId='vertical2'>
          <ListChannel data={onhold} />
        </TabPane>
        <TabPane tabId='vertical3'>
          <ListChannel data={approve} />
        </TabPane>
        <TabPane tabId='vertical4'>
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
                      Overview TrendzNetwork
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 2,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 2)}
                    >
                      Channel requests
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 3,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 3)}
                    >
                      Approved Channels
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 4,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 4)}
                    >
                      Unapproved Channels
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col>
                <TabContent activeTab={'vertical' + navState.vertical}>
                  <TabPane tabId='vertical1'>
                    <StatisticsChart />
                  </TabPane>
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
