import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardDeck,
  CardSubtitle,
  CardTitle,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import Skeleton from '@material-ui/lab/Skeleton';
import Link from 'next/link';

const { API_URL } = process.env;

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
const ListChannel = ({ data }) => {
  //   console.log('data ben day ne', data);
  return (
    <Row>
      <CardDeck>
        {data.length !== 0 ? (
          data.map((channel) => (
            <Col md={4} key={channel.id}>
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
                    <strong>Thể loại:</strong>{' '}
                    {channel.category.name !== null ? (
                      channel.category.name
                    ) : (
                      <Skeleton variant='text' />
                    )}
                  </CardSubtitle>
                  <CardSubtitle>
                    <strong>Trạng thái:</strong>{' '}
                    {renderChannelStatus(
                      channel.employeeConfirm,
                      channel.adminConfirm,
                      channel.status
                    )}
                  </CardSubtitle>
                  <CardSubtitle>
                    <strong>Ngày tạo:</strong>{' '}
                    <small className='text-muted'>
                      {channel.created_at !== undefined ? (
                        new Date(channel.created_at).toLocaleString('en-GB')
                      ) : (
                        <Skeleton variant='text' />
                      )}
                    </small>
                  </CardSubtitle>
                  <Link href='/channel/[chid]' as={`/channel/${channel.id}`}>
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
  );
};

export default ListChannel;
