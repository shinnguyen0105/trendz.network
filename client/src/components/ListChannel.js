import React from 'react';
import Link from 'next/link';

import Skeleton from '@material-ui/lab/Skeleton';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardTitle,
  Row,
  Col,
  Spinner,
} from 'reactstrap';

const { API_URL } = process.env;

const renderChannelStatus = (employeeConfirm, adminConfirm, status) => {
  if (
    employeeConfirm == null ||
    (employeeConfirm == true && adminConfirm == null)
  ) {
    return 'Waiting for licensing';
  }
  if (!employeeConfirm || !adminConfirm) {
    return 'Not licensed';
  }
  if (adminConfirm && employeeConfirm && status == false) {
    return 'Licensed - Inactive';
  }
  if (adminConfirm && employeeConfirm && status == true) {
    return 'Licensed - In operation';
  }
};
const ListChannel = ({ data }) => {
  //   console.log('data ben day ne', data);
  return (
    <Row>
      {data.length !== 0 ? (
        data.map((channel) => (
          <Col xs={12} md={4} key={channel.id}>
            <Card className='campaign-card'>
              {channel.avatar.formats !== null ? (
                <CardImg
                  src={`${API_URL}${channel.avatar.formats.thumbnail.url}`}
                  alt='Card image cap'
                  className='campaign-img'
                />
              ) : (
                <Skeleton variant='rect' width={350} height={300} />
              )}
              <CardBody>
                <CardTitle className='dashboard-card-title'>
                  {channel.name !== undefined ? (
                    channel.name
                  ) : (
                    <Skeleton variant='text' />
                  )}
                </CardTitle>
                <CardSubtitle>
                  <strong>Category:</strong>{' '}
                  {channel.category.name !== null ? (
                    channel.category.name
                  ) : (
                    <Skeleton variant='text' />
                  )}
                </CardSubtitle>
                <CardSubtitle>
                  <strong>Status:</strong>{' '}
                  {renderChannelStatus(
                    channel.employeeConfirm,
                    channel.adminConfirm,
                    channel.status
                  )}
                </CardSubtitle>
                <CardSubtitle>
                  <strong>Create at:</strong>{' '}
                  <small className='text-muted'>
                    {channel.created_at !== undefined ? (
                      new Date(channel.created_at).toLocaleString('en-GB')
                    ) : (
                      <Skeleton variant='text' />
                    )}
                  </small>
                </CardSubtitle>
                <Link href='/channel/[chid]' as={`/channel/${channel.id}`}>
                  <Button>Details</Button>
                </Link>
              </CardBody>
            </Card>
          </Col>
        ))
      ) : (
        <Spinner color='light' />
      )}
    </Row>
  );
};

export default ListChannel;
