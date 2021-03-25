import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/userContext';
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

import { sortBy } from '../utils/filters/sortBy';

import { REQUEST_GET_CAMPAIGNS_BY_INFLUENCER_ID } from '../graphql/query/campaign/getCampaigns';
import { REQUEST_GET_ALL_CATEGORIES } from '../graphql/query/category/getCategory';
import { REQUEST_GET_ALL_CHANNELS } from '../graphql/query/channel/getChannels';

import DashboardChildren from '../components/DashboardChildren';
import ListChannel from '../components/ListChannel';

const Dashboard = () => {
  const { state } = useAuth();
  const [navState, setNav] = useState({
    vertical: 1,
  });

  const [filterItems, setFilterItems] = useState({
    category: '',
    sort: '',
    search: '',
  });

  const [sortGraphqlFilter, setSortGraphqlFilter] = useState();
  const [searchGraphqlFilter, setSearchGraphqlFilter] = useState();

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
    setQuery('?');
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

  useEffect(() => {
    if (filterItems.sort !== '') {
      setSortGraphqlFilter(filterItems.sort);
    }
    if (filterItems.search !== '') {
      setSearchGraphqlFilter(filterItems.search);
    }
  }, [filterItems]);

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
  // console.log('filter', filterItems);
  function ListCampaigns() {
    const { loading, error, data } = useQuery(
      REQUEST_GET_CAMPAIGNS_BY_INFLUENCER_ID,
      {
        nextFetchPolicy: 'cache-and-network',
        variables: {
          idInfluencer: state.user.id,
          sort: sortGraphqlFilter,
          searchTitle: searchGraphqlFilter,
        },
      }
    );
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
    // console.log('data onhold:', onhold);
    // console.log('data approve:', approve);
    // console.log('data unapprove:', unapprove);
    return (
      <>
        <TabPane tabId='vertical1'>
          {filterItems.category != '' ? (
            <DashboardChildren data={onhold} categ={filterItems.category} />
          ) : (
            <DashboardChildren data={onhold} categ={''} />
          )}
        </TabPane>
        <TabPane tabId='vertical2'>
          {filterItems.category != '' ? (
            <DashboardChildren data={approve} categ={filterItems.category} />
          ) : (
            <DashboardChildren data={approve} categ={''} />
          )}
        </TabPane>
        <TabPane tabId='vertical3'>
          {filterItems.category != '' ? (
            <DashboardChildren data={unapprove} categ={filterItems.category} />
          ) : (
            <DashboardChildren data={unapprove} categ={''} />
          )}
        </TabPane>
      </>
    );
  }
  function ListChannels() {
    const { loading, error, data } = useQuery(REQUEST_GET_ALL_CHANNELS, {
      variables: {
        influencerID: state.user.id,
      },
    });
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    // console.log('channel ne:', data);
    return (
      <>
        <TabPane tabId='vertical4'>
          <ListChannel data={data} />
        </TabPane>
      </>
    );
  }
  return (
    <div className='shape shape-style-2 shape-default'>
      <div className='main'>
        <Button color='primary' className='btn-create' href='/create-channel'>
          Create Channel
        </Button>
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
                      onClick={(e) => {
                        toggleTabs(e, 'vertical', 1);
                        handleClearFilter();
                      }}
                    >
                      Campaign requests
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 2,
                      })}
                      onClick={(e) => {
                        toggleTabs(e, 'vertical', 2);
                        handleClearFilter();
                      }}
                    >
                      Approved Campaigns
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 3,
                      })}
                      onClick={(e) => {
                        toggleTabs(e, 'vertical', 3);
                        handleClearFilter();
                      }}
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
                      Channel của tôi
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col>
                <TabContent activeTab={'vertical' + navState.vertical}>
                  {navState.vertical !== 4 ? (
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
                            {/* useQuery return component*/}
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
                  <ListChannels />
                  {/* useQuery return component*/}
                  <ListCampaigns />
                </TabContent>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
