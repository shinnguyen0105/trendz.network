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

  const [categories, setCategories] = useState({
    categories: [],
  });

  const [query, setQuery] = useState('?');

  const [filterItems, setFilterItems] = useState({
    status: '',
    category: '',
    sort: '',
    search: '',
  });

  const [influencers, setInfluencers] = useState({
    influencers: [],
  });

  const [myCampaigns, setMyCampaigns] = useState({
    campaigns: [],
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
  const [searchGraphqlFilter, setSearchGraphqlFilter] = useState();

  useEffect(() => {
    if (filterItems.sort !== '') {
      setSortGraphqlFilter(filterItems.sort);
    }
    if (filterItems.search !== '') {
      setSearchGraphqlFilter(filterItems.search);
    }
  }, [filterItems]);
  // useEffect(() => {
  //   let query = '?';
  //   if (filterItems.search !== '' && query === '?') {
  //     query += 'title_contains=' + filterItems.search;
  //   } else if (filterItems.search !== '' && query !== '?')
  //     query += '&title_contains=' + filterItems.search;
  //   if (filterItems.category !== '' && query === '?') {
  //     query += '_where[category.id]=' + filterItems.category;
  //   } else if (filterItems.category !== '' && query !== '?')
  //     query += '&_where[category.id]=' + filterItems.category;
  //   if (filterItems.sort !== '' && query === '?') {
  //     query += filterItems.sort;
  //   } else if (filterItems.sort !== '' && query !== '?')
  //     query += '&' + filterItems.sort;
  //   if (filterItems.status !== '' && query === '?') {
  //     query += filterItems.status;
  //   } else if (filterItems.status !== '' && query !== '?')
  //     query += '&' + filterItems.status;
  //   setQuery(query);
  // }, [filterItems]);

  // useEffect(() => {
  //   let mountedCampaign = true;
  //   const campaignUrl = API_URL + '/campaigns' + query;
  //   const fetchCampaign = async () => {
  //     try {
  //       const get_resolve = await axios.get(campaignUrl, {
  //         cancelToken: signal.token,
  //         headers: {
  //           Authorization: `Bearer ${state.jwt}`,
  //         },
  //       });
  //       if (mountedCampaign) {
  //         try {
  //           setMyCampaigns({
  //             campaigns: get_resolve.data.filter(function (campaign) {
  //               return campaign.user.id == state.user.id;
  //             }),
  //           });
  //         } catch (error) {
  //           console.log(error);
  //         }
  //       }
  //     } catch (error) {
  //       if (axios.isCancel(error) && error.message !== undefined) {
  //         console.log('Error: ', error.message);
  //       }
  //     }
  //   };
  //   fetchCampaign();
  //   return function cleanup() {
  //     mountedCampaign = false;
  //     signal.cancel();
  //   };
  // }, [query]);

  // useEffect(() => {
  //   const campaignUrl = API_URL + '/campaigns';
  //   const influencersUrl = API_URL + '/users';
  //   const categoryUrl = API_URL + '/categories';
  //   const fetchCampaign = async () => {
  //     try {
  //       const get_resolve = await axios.get(campaignUrl, {
  //         cancelToken: signal.token,
  //         headers: {
  //           Authorization: `Bearer ${state.jwt}`,
  //         },
  //       });
  //       try {
  //         console.log(get_resolve.data);
  //         setMyCampaigns({
  //           campaigns: get_resolve.data.filter(function (campaign) {
  //             return campaign.user.id == state.user.id;
  //           }),
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } catch (error) {
  //       if (axios.isCancel(error) && error.message !== undefined) {
  //         console.log('Error: ', error.message);
  //       }
  //     }
  //   };
  //   const fetchInfluencers = async () => {
  //     try {
  //       const get_resolve = await axios.get(influencersUrl, {
  //         cancelToken: signal.token,
  //         headers: {
  //           Authorization: `Bearer ${state.jwt}`,
  //         },
  //       });
  //       try {
  //         setInfluencers({
  //           influencers: get_resolve.data.filter(function (user) {
  //             return user.role.name == 'Influencer';
  //           }),
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } catch (error) {
  //       if (axios.isCancel(error) && error.message !== undefined) {
  //         console.log('Error: ', error.message);
  //       }
  //     }
  //   };
  //   const fetchCategories = async () => {
  //     try {
  //       const get_resolve = await axios.get(categoryUrl, {
  //         cancelToken: signal.token,
  //         headers: {
  //           Authorization: `Bearer ${state.jwt}`,
  //         },
  //       });
  //       try {
  //         setCategories({
  //           categories: get_resolve.data,
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } catch (error) {
  //       if (axios.isCancel(error) && error.message !== undefined) {
  //         console.log('Error: ', error.message);
  //       }
  //     }
  //   };
  //   fetchCampaign();
  //   fetchInfluencers();
  //   fetchCategories();
  //   return function cleanup() {
  //     signal.cancel();
  //   };
  // }, []);

  function FetchInfluencer() {
    const { loading, error, data } = useQuery(REQUEST_GET_ALL_INFLUENCERS, {
      nextFetchPolicy: 'cache-and-network',
    });
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
                      Tạo Campaign
                    </Button>
                  </Link>
                  <TabPane tabId='vertical1'>
                    <FetchInfluencer />
                  </TabPane>
                  <TabPane tabId='vertical2'>
                    <Row>
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
                          <CardSubtitle>Trạng thái</CardSubtitle>
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
                                ? 'Chọn Trạng thái...'
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
