import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/userContext';
import { useQuery } from 'react-apollo';

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

import DashboardChildren from '../../ListCampaign';
import ListChannel from '../../ListChannel';

import { sortBy } from '../../../utils/filters/sortBy';
import { REQUEST_GET_ALL_CAMPAIGNS } from '../../../graphql/query/campaign/getCampaigns';
import { REQUEST_GET_ALL_CATEGORIES } from '../../../graphql/query/category/getCategory';
import { REQUEST_ALL_CHANNELS } from '../../../graphql/query/channel/getChannels';

const { API_URL } = process.env;

const EmployeeDashboard = () => {
  const { state } = useAuth();
  const [navState, setNav] = useState({
    vertical: 1,
  });

  const [categories, setCategories] = useState({
    categories: [],
  });

  const [onHoldChannels, setOnHoldChannels] = useState({
    channels: [],
  });

  const [approvedChannels, setApprovedChannels] = useState({
    channels: [],
  });

  const [unApprovedChannels, setUnApprovedChannels] = useState({
    channels: [],
  });

  const [onHoldCampaigns, setOnHoldCampaigns] = useState({
    campaigns: [],
  });

  const [approvedCampaigns, setApprovedCampaigns] = useState({
    campaigns: [],
  });

  const [unApprovedCampaigns, setUnApprovedCampaigns] = useState({
    campaigns: [],
  });

  const [filterItems, setFilterItems] = useState({
    category: '',
    sort: '',
    search: '',
  });

  const [query, setQuery] = useState('?');

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

  const renderStatus = (approvalStatus, influencerStatus, status) => {
    if (approvalStatus == null) {
      return 'Đang chờ cấp phép';
    }
    if (!approvalStatus) {
      return 'Không được cấp phép';
    }
    if (approvalStatus && influencerStatus == null) {
      return 'Đã được cấp phép - Đang chờ influencer xác nhận';
    }
    if (approvalStatus && !influencerStatus) {
      return 'Đã được cấp phép - Influencer đã từ chối';
    }
    if (approvalStatus && influencerStatus && status == false) {
      return 'Đã được cấp phép - Influencer đã chấp thuận - Đang hoạt động';
    } else return 'Đã được cấp phép - Influencer đã chấp thuận - Đã kết thúc';
  };

  const renderChannelStatus = (employeeConfirm, adminConfirm, status) => {
    if (
      employeeConfirm == null ||
      (employeeConfirm == true && adminConfirm == null)
    ) {
      return 'Đang chờ cấp phép';
    }
    if (!employeeConfirm || !adminConfirm) {
      return 'Không được cấp phép';
    }
    if (adminConfirm && employeeConfirm && status == false) {
      return 'Đã được cấp phép - Đang dừng hoạt động';
    }
    if (adminConfirm && employeeConfirm && status == true) {
      return 'Đã được cấp phép - Đang hoạt động';
    }
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
  //     const fetchChannels = async () => {
  //       try {
  //         const get_resolve = await axios.get(channelUrl, {
  //           cancelToken: signal.token,
  //           headers: {
  //             Authorization: `Bearer ${state.jwt}`,
  //           },
  //         });
  //         try {
  //           try {
  //             setOnHoldChannels({
  //               channels: get_resolve.data.filter(function (channel) {
  //                 return channel.employeeConfirm == null;
  //               }),
  //             });
  //             setApprovedChannels({
  //               channels: get_resolve.data.filter(function (channel) {
  //                 return channel.employeeConfirm == true;
  //               }),
  //             });
  //             setUnApprovedChannels({
  //               channels: get_resolve.data.filter(function (channel) {
  //                 return channel.employeeConfirm == false;
  //               }),
  //             });
  //           } catch (error) {
  //             console.log(error);
  //           }
  //         } catch (error) {
  //           console.log(error);
  //         }
  //       } catch (error) {
  //         if (axios.isCancel(error) && error.message !== undefined) {
  //           console.log('Error: ', error.message);
  //         }
  //       }
  //     };
  //     fetchCampaign();
  //     fetchCategories();
  //     fetchChannels();
  //     return function cleanup() {
  //       signal.cancel();
  //     };
  //   }, []);

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
                  {/* <TabPane tabId='vertical1'>
                    <Row>
                      <CardDeck>
                        {onHoldCampaigns.campaigns.length !== 0 ? (
                          onHoldCampaigns.campaigns.map((campaign) => (
                            <Col md={4} key={campaign.id}>
                              <Card className='campaign-card'>
                                {campaign.picture[0] !== undefined ? (
                                  <CardImg
                                    src={`${API_URL}${campaign.picture[0].formats.thumbnail.url}`}
                                    alt='Card image cap'
                                    className='campaign-img'
                                  />
                                ) : (
                                  <Skeleton
                                    variant='rect'
                                    width={256}
                                    height={186}
                                  />
                                )}
                                <CardBody>
                                  <CardTitle className='dashboard-card-title'>
                                    {campaign.title !== undefined ? (
                                      campaign.title
                                    ) : (
                                      <Skeleton variant='text' />
                                    )}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{' '}
                                    {campaign.user !== null ? (
                                      campaign.user.username
                                    ) : (
                                      <Skeleton variant='text' />
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{' '}
                                    {renderStatus(
                                      campaign.approve,
                                      campaign.status,
                                      campaign.completed
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>
                                      Ngày bắt đầu - Ngày kết thúc:
                                    </strong>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <small className='text-muted'>
                                      {campaign.campaignTTL[0] !== undefined ? (
                                        new Date(
                                          campaign.campaignTTL[0].open_datetime
                                        ).toLocaleString('en-GB') +
                                        ' - ' +
                                        new Date(
                                          campaign.campaignTTL[0].close_datetime
                                        ).toLocaleString('en-GB')
                                      ) : (
                                        <Skeleton variant='text' />
                                      )}
                                    </small>
                                  </CardSubtitle>
                                  <Link
                                    href='/campaign/[cid]'
                                    as={`/campaign/${campaign.id}`}
                                  >
                                    <Button>Chi tiết</Button>
                                  </Link>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <Spinner color='light' />
                        )}
                      </CardDeck>
                    </Row>
                  </TabPane>
                  <TabPane tabId='vertical2'>
                    <Row>
                      <CardDeck>
                        {approvedCampaigns.campaigns.length !== 0 ? (
                          approvedCampaigns.campaigns.map((campaign) => (
                            <Col md={4} key={campaign.id}>
                              <Card className='campaign-card'>
                                <CardImg
                                  src={
                                    campaign.picture[0] !== undefined
                                      ? `
                                        ${API_URL}${campaign.picture[0].formats.thumbnail.url}`
                                      : '/256x186.svg'
                                  }
                                  alt='Card image cap'
                                  className='campaign-img'
                                />
                                <CardBody>
                                  <CardTitle className='dashboard-card-title'>
                                    {campaign.title}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{' '}
                                    {campaign.user.username}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{' '}
                                    {renderStatus(
                                      campaign.approve,
                                      campaign.status,
                                      campaign.completed
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>
                                      Ngày bắt đầu - Ngày kết thúc:
                                    </strong>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <small className='text-muted'>
                                      {new Date(
                                        campaign.campaignTTL[0].open_datetime
                                      ).toLocaleString('en-GB') +
                                        ' - ' +
                                        new Date(
                                          campaign.campaignTTL[0].close_datetime
                                        ).toLocaleString('en-GB')}
                                    </small>
                                  </CardSubtitle>

                                  <Link
                                    href='/campaign/[cid]'
                                    as={`/campaign/${campaign.id}`}
                                  >
                                    <Button>Chi tiết</Button>
                                  </Link>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <Spinner color='light' />
                        )}
                      </CardDeck>
                    </Row>
                  </TabPane>
                  <TabPane tabId='vertical3'>
                    <Row>
                      <CardDeck>
                        {unApprovedCampaigns.campaigns.length !== 0 ? (
                          unApprovedCampaigns.campaigns.map((campaign) => (
                            <Col md={4} key={campaign.id}>
                              <Card className='campaign-card'>
                                <CardImg
                                  src={
                                    campaign.picture[0] !== undefined
                                      ? `
                                        ${API_URL}${campaign.picture[0].formats.thumbnail.url}`
                                      : '/256x186.svg'
                                  }
                                  alt='Card image cap'
                                  className='campaign-img'
                                />
                                <CardBody>
                                  <CardTitle className='dashboard-card-title'>
                                    {campaign.title}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{' '}
                                    {campaign.user.username}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{' '}
                                    {renderStatus(
                                      campaign.approve,
                                      campaign.status,
                                      campaign.completed
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>
                                      Ngày bắt đầu - Ngày kết thúc:
                                    </strong>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <small className='text-muted'>
                                      {new Date(
                                        campaign.campaignTTL[0].open_datetime
                                      ).toLocaleString('en-GB') +
                                        ' - ' +
                                        new Date(
                                          campaign.campaignTTL[0].close_datetime
                                        ).toLocaleString('en-GB')}
                                    </small>
                                  </CardSubtitle>

                                  <Link
                                    href='/campaign/[cid]'
                                    as={`/campaign/${campaign.id}`}
                                  >
                                    <Button>Chi tiết</Button>
                                  </Link>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <Spinner color='light' />
                        )}
                      </CardDeck>
                    </Row>
                  </TabPane> */}
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
