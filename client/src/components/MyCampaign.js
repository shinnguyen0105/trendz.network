import React from 'react';
import Link from 'next/link';
import classnames from 'classnames';
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

const { API_URL } = process.env;
const renderStatus = (status) => {
  if (status !== null) {
    if (status) {
      return 'Đang hoạt động';
    } else return 'Không hoạt động';
  } else return 'Đang chờ kích hoạt';
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
                    <strong>Người tạo:</strong> {campaign.user.name}
                  </CardSubtitle>
                  <CardSubtitle>
                    <strong>Trạng thái:</strong> {renderStatus(campaign.status)}
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
    </>
  );
};

export default MyCampaign;
