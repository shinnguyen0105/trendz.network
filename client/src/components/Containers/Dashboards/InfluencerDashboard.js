import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/userContext';
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

import { sortBy } from '../../../utils/filters/sortBy';
import { REQUEST_GET_CAMPAIGNS_BY_INFLUENCER_ID } from '../../../graphql/query/campaign/getCampaigns';
import { REQUEST_GET_ALL_CATEGORIES } from '../../../graphql/query/category/getCategory';
import { REQUEST_GET_MY_CHANNELS } from '../../../graphql/query/channel/getChannels';

import ListCampaignsChild from '../../ListCampaign';
import ListChannel from '../../ListChannel';

const InfluencerDashboard = () => {
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
  console.log(filterItems);
  useEffect(() => {
    if (filterItems.sort !== '') {
      setSortGraphqlFilter(filterItems.sort);
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
            ? 'Select Category'
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
        variables: {
          idInfluencer: state.user.id,
          sort: sortGraphqlFilter,
        },
      }
    );
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    console.log(data);
    let campaigns = data.campaigns;
    let onhold = campaigns.filter(
      (campaign) => campaign.approve == true && campaign.status == null
    );
    let approve = campaigns.filter(
      (campaign) =>
        campaign.approve == true &&
        campaign.status == true &&
        campaign.influencerCompleted == false
    );
    let unapprove = campaigns.filter(
      (campaign) => campaign.approve == true && campaign.status == false
    );
    let completed = campaigns.filter((campaign) => campaign.completed == true);
    // console.log('data onhold:', onhold);
    // console.log('data approve:', approve);
    // console.log('data unapprove:', unapprove);
    return (
      <>
        <TabPane tabId='vertical1'>
          <ListCampaignsChild
            data={onhold}
            categ={filterItems.category}
            search={filterItems.search}
          />
        </TabPane>
        <TabPane tabId='vertical2'>
          <ListCampaignsChild
            data={approve}
            categ={filterItems.category}
            search={filterItems.search}
          />
        </TabPane>
        <TabPane tabId='vertical3'>
          <ListCampaignsChild
            data={unapprove}
            categ={filterItems.category}
            search={filterItems.search}
          />
        </TabPane>
        <TabPane tabId='vertical4'>
          <ListCampaignsChild
            data={completed}
            categ={filterItems.category}
            search={filterItems.search}
          />
        </TabPane>
      </>
    );
  }
  function ListChannels() {
    const { loading, error, data } = useQuery(REQUEST_GET_MY_CHANNELS, {
      variables: {
        influencerID: state.user.id,
      },
    });
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    // console.log('channel ne:', data);
    let channelData = data.channels;
    return (
      <TabPane tabId='vertical5'>
        <ListChannel data={channelData} />
      </TabPane>
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
                      onClick={(e) => {
                        toggleTabs(e, 'vertical', 4);
                      }}
                    >
                      Campaigns Completed
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 5,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 5)}
                    >
                      My Channel
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col>
                <TabContent activeTab={'vertical' + navState.vertical}>
                  {navState.vertical !== 5 ? (
                    <Row style={{ marginTop: '30px' }}>
                      <Col>
                        <Row>
                          <CardSubtitle>Search</CardSubtitle>
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
                          <CardSubtitle>Category</CardSubtitle>
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
                          <CardSubtitle>Sorted by</CardSubtitle>
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
                                ? 'Sorted by...'
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
                            Clear Filter
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

export default InfluencerDashboard;
