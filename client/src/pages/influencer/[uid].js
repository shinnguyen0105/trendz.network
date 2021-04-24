import React, { useEffect } from 'react';

import { useAuth } from '../../contexts/userContext';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Router from 'next/router';

import { useQuery } from 'react-apollo';
import { REQUEST_GET_INFLUENCER_DETAILS } from '../../graphql/query/influencer/getInfluencers';

import {
  Card,
  CardBody,
  CardImg,
  Container,
  CardTitle,
  CardText,
  CardDeck,
  Row,
  CardSubtitle,
  Button,
  Col,
} from 'reactstrap';
import { Skeleton } from '@material-ui/lab';

const { API_URL } = process.env;

const Influencer = () => {
  const router = useRouter();
  const { uid } = router.query;
  const { state } = useAuth();

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

  useEffect(() => {
    if (state.jwt === '') Router.push('/login');
  }, [state]);

  function FetchInfluencerDetails() {
    const { loading, error, data } = useQuery(REQUEST_GET_INFLUENCER_DETAILS, {
      variables: {
        influencerID: uid,
      },
    });
    if (loading)
      return (
        <Card>
          <Container>
            <Card className='single-card'>
              <Skeleton variant='rect' width={256} height={186} />
            </Card>
          </Container>
        </Card>
      );
    if (error) return null;
    let influencerInfor = data.channels[0].user;
    let channels = data.channels;
    return (
      <Card>
        <Container>
          <Card className='single-card'>
            <CardImg
              src={
                influencerInfor.avatar.formats !== null
                  ? `${API_URL}${influencerInfor.avatar.formats.small.url}`
                  : `${API_URL}${influencerInfor.avatar.url}`
              }
              alt='Card image cap'
              className='campaign-detail-img'
            />
            <CardBody>
              <CardTitle>{influencerInfor.name}</CardTitle>
              <CardText>Số điện thoại: {influencerInfor.phoneNumber}</CardText>
              <CardText>Email liên hệ: {influencerInfor.email}</CardText>
              <br />
              <CardTitle>
                Các kênh thuộc sở hữu của {influencerInfor.name}:
              </CardTitle>
            </CardBody>
            <CardBody>
              <Row>
                <CardDeck>
                  {channels.length !== 0
                    ? channels.map((channel) => (
                        <Col md={4} key={channel.id}>
                          <Card className='campaign-card'>
                            {channel.avatar.formats.thumbnail !== null ? (
                              <CardImg
                                src={`${API_URL}${channel.avatar.formats.thumbnail.url}`}
                                alt='Card image cap'
                                className='campaign-img'
                              />
                            ) : (
                              <Skeleton
                                variant='rect'
                                width={350}
                                height={300}
                              />
                            )}
                            <CardBody>
                              <CardSubtitle>
                                {channel.name !== undefined ? (
                                  <strong>{channel.name}</strong>
                                ) : (
                                  <Skeleton variant='text' />
                                )}
                              </CardSubtitle>
                              <CardText>
                                <strong>Trạng thái:</strong>{' '}
                                {renderChannelStatus(
                                  channel.employeeConfirm,
                                  channel.adminConfirm,
                                  channel.status
                                )}
                              </CardText>
                              <CardText>
                                <strong>Mức giá:</strong> {channel.price} VNĐ
                              </CardText>
                              <Link
                                href='/channel/[chid]'
                                as={`/channel/${channel.id}`}
                              >
                                <Button>Chi tiết</Button>
                              </Link>
                            </CardBody>
                          </Card>
                        </Col>
                      ))
                    : ''}
                </CardDeck>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </Card>
    );
  }
  return (
    <div className='wrapper'>
      <div className='main'>
        <FetchInfluencerDetails />
      </div>
    </div>
  );
};

export default Influencer;
