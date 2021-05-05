import React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardDeck,
  CardSubtitle,
  CardTitle,
  Col,
  Spinner,
} from 'reactstrap';
import Skeleton from '@material-ui/lab/Skeleton';

const { API_URL } = process.env;
const renderStatus = (approve, status, influencerCompleted, completed) => {
  if (approve == null) {
    return 'Waiting employee approve';
  }
  if (approve == false) {
    return 'Employee rejected!';
  }
  if (approve == true && status == null) {
    return 'Waiting influencer approve';
  }
  if (approve == true && status == true && influencerCompleted == false) {
    return 'Initiating campaign';
  }
  if (influencerCompleted || completed) {
    return 'Completed!';
  }
};
const MyCampaign = ({ data, categ, search }) => {
  var myCampaign;
  var searchItem = search.toLowerCase();
  console.log(searchItem);
  if (categ != '' && search == '') {
    myCampaign = data.filter((c) => c.category.id == categ);
  } else if (search != '' && categ == '') {
    myCampaign = data.filter((c) =>
      c.title.toLowerCase().includes(`${searchItem}`)
    );
  } else if (categ != '' && search != '') {
    myCampaign = data.filter(
      (c) =>
        c.title.toLowerCase().includes(`${searchItem}`) &&
        c.category.id == categ
    );
  } else if (categ == '' && search == '') {
    myCampaign = data;
  }
  console.log(data);
  return (
    <>
      {data.length !== 0 ? (
        myCampaign.map((campaign) => (
          <Col md={4} xs={12} key={campaign.id}>
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
                  <strong>Create by:</strong> {campaign.user.name}
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
                    campaign.influencerCompleted,
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
    </>
  );
};

export default MyCampaign;
