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

const ListCampaignsChild = ({ data, categ, search, roleType }) => {
  function renderStatus(approvalStatus, influencerStatus, status) {
    if ((roleType = 'Employee')) {
      if (approvalStatus == null) {
        return 'Waiting for licensing';
      }
      if (!approvalStatus) {
        return 'Not licensed';
      }
      if (approvalStatus && influencerStatus == null) {
        return 'Đã được cấp phép - Đang chờ Influencer approve';
      }
      if (approvalStatus && !influencerStatus) {
        return 'Licensed - Influencer declined';
      }
      if (approvalStatus && influencerStatus && status == false) {
        return 'Licensed - Influencer approved - Being Active';
      } else return 'Licensed - Influencer approved - Ended';
    } else {
      if (approvalStatus == true && influencerStatus == null) {
        return 'Waiting for Influencer approval';
      }
      if (approvalStatus == true && influencerStatus == true) {
        return 'Approved - Ongoing';
      }
      if (approvalStatus == true && influencerStatus == false) {
        return 'Licensed - Influencer declined';
      }
      if (approvalStatus && influencerStatus && status == false) {
        return 'Licensed - Influencer approved - Being Active';
      } else return 'Licensed - Influencer approved - Ended';
    }
  }

  var campaign;
  var searchItem = search.toLowerCase();
  console.log(searchItem);
  if (categ != '' && search == '') {
    campaign = data.filter((c) => c.category.id == categ);
  } else if (search != '' && categ == '') {
    campaign = data.filter((c) =>
      c.title.toLowerCase().includes(`${searchItem}`)
    );
  } else if (categ != '' && search != '') {
    campaign = data.filter(
      (c) =>
        c.title.toLowerCase().includes(`${searchItem}`) &&
        c.category.id == categ
    );
  } else if (categ == '' && search == '') {
    campaign = data;
  }
  console.log(campaign);
  return (
    <Row>
      {campaign != undefined ? (
        campaign.map((campaign) => (
          <Col xs={12} md={4} key={campaign.id}>
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
                  <strong>Create by:</strong>{' '}
                  {campaign.user !== null ? (
                    campaign.user.name
                  ) : (
                    <Skeleton variant='text' />
                  )}
                </CardSubtitle>
                <CardSubtitle>
                  <strong>Price:</strong>{' '}
                  {campaign.price.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </CardSubtitle>
                <CardSubtitle>
                  <strong>Status:</strong>{' '}
                  {renderStatus(
                    campaign.approve,
                    campaign.status,
                    campaign.completed
                  )}
                </CardSubtitle>
                <CardSubtitle>
                  <strong>Start date - End date:</strong>
                </CardSubtitle>
                <CardSubtitle>
                  <small className='text-muted'>
                    {campaign.campaignTTL !== undefined ? (
                      new Date(
                        campaign.campaignTTL.open_datetime
                      ).toLocaleString('en-GB') +
                      ' - ' +
                      new Date(
                        campaign.campaignTTL.close_datetime
                      ).toLocaleString('en-GB')
                    ) : (
                      <Skeleton variant='text' />
                    )}
                  </small>
                </CardSubtitle>
                <CardSubtitle className='text-center'>
                  <Link href='/campaign/[cid]' as={`/campaign/${campaign.id}`}>
                    <Button>Details</Button>
                  </Link>
                </CardSubtitle>
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

export default ListCampaignsChild;
