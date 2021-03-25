import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardDeck,
  CardSubtitle,
  CardTitle,
  TabPane,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import Skeleton from '@material-ui/lab/Skeleton';
import Link from 'next/link';

const { API_URL } = process.env;
const renderStatus = (approvalStatus, influencerStatus, status) => {
  if (approvalStatus == true && influencerStatus == null) {
    return 'Đang chờ influencer chấp thuận';
  }
  if (approvalStatus == true && influencerStatus == true) {
    return 'Đã được chấp thuận - Đang thực hiện';
  }
  if (approvalStatus == true && influencerStatus == false) {
    return 'Đã được cấp phép - Influencer đã từ chối';
  }
  if (approvalStatus && influencerStatus && status == false) {
    return 'Đã được cấp phép - Influencer đã chấp thuận - Đang hoạt động';
  } else return 'Đã được cấp phép - Influencer đã chấp thuận - Đã kết thúc';
};
const DashboardChildren = ({ data, categ }) => {
  if (categ != '') {
    var campaign = data.filter((c) => c.category.id == categ);
  } else {
    var campaign = data;
  }
  return (
    <Row>
      <CardDeck>
        {campaign != undefined ? (
          campaign.map((campaign) => (
            <Col md={4} key={campaign.id}>
              <Card className='campaign-card'>
                {campaign.picture[0] !== undefined ? (
                  <CardImg
                    src={`${API_URL}${campaign.picture[0].formats.thumbnail.url}`}
                    alt='Card image cap'
                    className='campaign-img'
                  />
                ) : (
                  <Skeleton variant='rect' width={256} height={186} />
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
                    <strong>Ngày bắt đầu - Ngày kết thúc:</strong>
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
                  <Link href='/campaign/[cid]' as={`/campaign/${campaign.id}`}>
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

export default DashboardChildren;
