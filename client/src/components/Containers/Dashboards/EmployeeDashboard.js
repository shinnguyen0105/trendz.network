import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';

import classnames from 'classnames';
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Skeleton from '@material-ui/lab/Skeleton';

import DashboardChildren from '../../ListCampaign';
import ListChannel from '../../ListChannel';

import { sortBy } from '../../../utils/filters/sortBy';
import { REQUEST_GET_ALL_CAMPAIGNS } from '../../../graphql/query/campaign/getCampaigns';
import { REQUEST_GET_ALL_CATEGORIES } from '../../../graphql/query/category/getCategory';
import { REQUEST_ALL_CHANNELS } from '../../../graphql/query/channel/getChannels';

const EmployeeDashboard = () => {
  const [navState, setNav] = useState({
    vertical: 1,
  });

  const [filterItems, setFilterItems] = useState({
    category: '',
    sort: '',
    search: '',
  });

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
    setFilterItems({
      category: '',
      sort: '',
      search: '',
    });
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setFilterItems((previousState) => {
      return {
        ...previousState,
        [name]: value,
      };
    });
  };

  const handleFilterItemsChange = (name, value) => {
    setFilterItems((previousState) => {
      return {
        ...previousState,
        [name]: value,
      };
    });
  };

  const handleClearFilter = () => {
    setFilterItems({
      category: '',
      sort: '',
      search: '',
    });
  };
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
          {filterItems.category === ''
            ? 'Chọn Danh mục...'
            : data.categories.find(
                (category) => category.id === filterItems.category
              ).name}
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu'>
          {data.categories.map((category) => (
            <DropdownItem
              key={category.id}
              onClick={(event) => {
                event.preventDefault();
                handleFilterItemsChange('category', category.id);
              }}
            >
              {category.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </>
    );
  }
  function ListCampaigns() {
    const { loading, error, data } = useQuery(REQUEST_GET_ALL_CAMPAIGNS, {
      nextFetchPolicy: 'cache-and-network',
    });
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    let campaigns = data.campaigns;
    let onhold = campaigns.filter(
      (campaign) => campaign.approve == true && campaign.status == null
    );
    let approve = campaigns.filter(
      (campaign) => campaign.approve && campaign.status == true
    );
    let unapprove = campaigns.filter(
      (campaign) => campaign.approve == true && campaign.status == false
    );
    // console.log('onhold', onhold);
    // console.log('onhold', approve);
    // console.log('onhold', unapprove);
    return (
      <>
        <TabPane tabId='vertical1'>
          <DashboardChildren
            data={onhold}
            categ={filterItems.category}
            search={filterItems.search}
            roleType={'Employee'}
          />
        </TabPane>
        <TabPane tabId='vertical2'>
          <DashboardChildren
            data={approve}
            categ={filterItems.category}
            search={filterItems.search}
            roleType={'Employee'}
          />
        </TabPane>
        <TabPane tabId='vertical3'>
          <DashboardChildren
            data={unapprove}
            categ={filterItems.category}
            search={filterItems.search}
            roleType={'Employee'}
          />
        </TabPane>
      </>
    );
  }
  function ListChannels() {
    const { loading, error, data } = useQuery(REQUEST_ALL_CHANNELS, {
      nextFetchPolicy: 'cache-and-network',
    });
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    let channels = data.channels;
    let onhold = channels.filter((channel) => channel.employeeConfirm == null);
    let approve = channels.filter((channel) => channel.employeeConfirm == true);
    let unapprove = channels.filter(
      (channel) => channel.employeeConfirm == false
    );
    console.log('onhold channel', onhold);
    console.log('onhold channel', approve);
    console.log('onhold channel', unapprove);

    return (
      <>
        <TabPane tabId='vertical4'>
          <ListChannel data={onhold} />
        </TabPane>
        <TabPane tabId='vertical5'>
          <ListChannel data={approve} />
        </TabPane>
        <TabPane tabId='vertical6'>
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
                      Campaign requests
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 2,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 2)}
                    >
                      Approved Campaigns
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 3,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 3)}
                    >
                      Unapproved Campaigns
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 4,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 4)}
                    >
                      Channel requests
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 5,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 5)}
                    >
                      Approved Channels
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 6,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 6)}
                    >
                      Unapproved Channels
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col>
                <TabContent activeTab={'vertical' + navState.vertical}>
                  {navState.vertical <= 3 ? (
                    <Row style={{ marginTop: '30px' }}>
                      <Col>
                        <Row>
                          <CardSubtitle>Tìm kiếm</CardSubtitle>
                        </Row>
                        <Row>
                          <Input
                            type='text'
                            value={filterItems.search}
                            name='search'
                            id='search'
                            onChange={handleSearchChange}
                          />
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <CardSubtitle>Danh mục</CardSubtitle>
                        </Row>
                        <Row>
                          <UncontrolledDropdown group>
                            <FetchCategories />
                          </UncontrolledDropdown>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <CardSubtitle>Sắp xếp theo</CardSubtitle>
                        </Row>
                        <Row>
                          <UncontrolledDropdown group>
                            <DropdownToggle
                              caret
                              color='secondary'
                              data-toggle='dropdown'
                              className='mydropdown'
                            >
                              {filterItems.sort === ''
                                ? 'Sắp xếp theo...'
                                : sortBy.find(
                                    (sort) => sort.value === filterItems.sort
                                  ).type}
                            </DropdownToggle>
                            <DropdownMenu className='dropdown-menu'>
                              {sortBy.map((sort) => (
                                <DropdownItem
                                  key={sort.id}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleFilterItemsChange('sort', sort.value);
                                  }}
                                >
                                  {sort.type}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <CardSubtitle></CardSubtitle>
                        </Row>
                        <Row>
                          <Button
                            onClick={handleClearFilter}
                            color='warning'
                            style={{ marginTop: '19px' }}
                          >
                            Làm sạch bộ lọc
                          </Button>
                        </Row>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                  <ListCampaigns />
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

export default EmployeeDashboard;
