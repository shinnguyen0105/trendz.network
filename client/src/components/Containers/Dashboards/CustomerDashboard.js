import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';

import { useAuth } from '../../../contexts/userContext';

import Link from 'next/link';
import classnames from 'classnames';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardDeck,
  CardSubtitle,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  Row,
  Col,
  Spinner,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import Skeleton from '@material-ui/lab/Skeleton';

import { campaignStatuses } from '../../../utils/filters/campaignStatus';
import { sortBy } from '../../../utils/filters/sortBy';
import { REQUEST_GET_ALL_INFLUENCERS } from '../../../graphql/query/influencer/getInfluencers';
import { REQUEST_GET_MY_CAMPAIGNS } from '../../../graphql/query/campaign/getCampaigns';
import { REQUEST_GET_ALL_CATEGORIES } from '../../../graphql/query/category/getCategory';

import ListInfluencer from '../../ListInfluencer';
import MyCampaign from '../../MyCampaign';

const CustomerDashboard = () => {
  const { state } = useAuth();
  const [navState, setNav] = useState({
    vertical: 1,
  });
  const [filterItems, setFilterItems] = useState({
    status: '',
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
      status: '',
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
      status: '',
      category: '',
      sort: '',
      search: '',
    });
  };

  const [sortGraphqlFilter, setSortGraphqlFilter] = useState();

  useEffect(() => {
    if (filterItems.sort !== '') {
      setSortGraphqlFilter(filterItems.sort);
    }
  }, [filterItems]);

  function FetchInfluencer() {
    const { loading, error, data } = useQuery(REQUEST_GET_ALL_INFLUENCERS);
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    return (
      <>
        <ListInfluencer data={data} />
      </>
    );
  }
  function FetchMyCampaigns() {
    const { loading, error, data } = useQuery(REQUEST_GET_MY_CAMPAIGNS, {
      variables: {
        idCustomer: state.user.id,
        sort: sortGraphqlFilter,
      },
    });
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    var myCampaigns;
    if (filterItems.status != '') {
      switch (filterItems.status) {
        case 1:
          myCampaigns = data.campaigns.filter((c) => c.approve == null);
          break;
        case 2:
          myCampaigns = data.campaigns.filter(
            (c) => c.approve == true && c.status == null
          );
          break;
        case 3:
          myCampaigns = data.campaigns.filter(
            (c) =>
              c.approve == true && c.status == false && c.completed == false
          );
          break;
        case 4:
          myCampaigns = data.campaigns.filter(
            (c) => c.approve == true && c.status == true && c.completed == false
          );
          break;
        case 5:
          myCampaigns = data.campaigns.filter(
            (c) => c.approve == true && c.status == true && c.completed == true
          );
          break;
      }
    } else {
      myCampaigns = data.campaigns;
    }
    console.log(filterItems);
    return (
      <>
        <MyCampaign
          data={myCampaigns}
          categ={filterItems.category}
          search={filterItems.search}
        />
      </>
    );
  }
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
                      Influencers
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 2,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 2)}
                    >
                      My Campaigns
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col>
                <TabContent activeTab={'vertical' + navState.vertical}>
                  <Link href='/create'>
                    <Button color='primary' className='btn-create'>
                      Create Campaign
                    </Button>
                  </Link>
                  <TabPane tabId='vertical1'>
                    <FetchInfluencer />
                  </TabPane>
                  <TabPane tabId='vertical2'>
                    <Row>
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
                            <FetchCategories />
                          </UncontrolledDropdown>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <CardSubtitle>Status</CardSubtitle>
                        </Row>
                        <Row>
                          <UncontrolledDropdown group>
                            <DropdownToggle
                              caret
                              color='secondary'
                              data-toggle='dropdown'
                              className='mydropdown'
                            >
                              {filterItems.status === ''
                                ? 'Select status...'
                                : campaignStatuses.find(
                                    (status) => status.id === filterItems.status
                                  ).status}
                            </DropdownToggle>
                            <DropdownMenu className='dropdown-menu'>
                              {campaignStatuses.map((status) => (
                                <DropdownItem
                                  key={status.id}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleFilterItemsChange(
                                      'status',
                                      status.id
                                    );
                                  }}
                                >
                                  {status.status}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
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
                    <Row>
                      <FetchMyCampaigns />
                    </Row>
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
