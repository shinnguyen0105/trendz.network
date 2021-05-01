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
const renderStatus = (status) => {
  if (status !== null) {
    if (status) {
      return 'Being active';
    } else return 'Inactive';
  } else return 'Waiting for activation';
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
      <CardDeck>
        {data.length !== 0 ? (
          myCampaign.map((campaign) => (
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
                    <strong>Status:</strong> {renderStatus(campaign.status)}
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
                    <Link
                      href='/campaign/[cid]'
                      as={`/campaign/${campaign.id}`}
                    >
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
      </CardDeck>
    </>
  );
};

export default MyCampaign;
