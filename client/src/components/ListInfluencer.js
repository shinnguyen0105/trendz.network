import React from 'react';

import Link from 'next/link';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardDeck,
  CardTitle,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import Skeleton from '@material-ui/lab/Skeleton';

const { API_URL } = process.env;

const ListInfluencer = ({ data }) => {
  console.log(data);
  return (
    <>
      <Row>
        {data.users.length !== 0 ? (
          data.users.map((influencer) => (
            <Col md={4} key={influencer.id}>
              <Card className='campaign-card'>
                {influencer.avatar !== null ? (
                  <CardImg
                    src={`${API_URL}${influencer.avatar.formats.thumbnail.url}`}
                    alt='Card image cap'
                    className='campaign-img'
                  />
                ) : (
                  <CardImg
                    src='/256x186.svg'
                    alt='Card image cap'
                    className='campaign-img'
                  />
                )}
                <CardBody>
                  <CardTitle className='dashboard-card-title'>
                    {influencer.name !== null ? (
                      influencer.name
                    ) : (
                      <Skeleton variant='text' />
                    )}
                  </CardTitle>
                  <Link
                    href='/influencer/[uid]'
                    as={`/influencer/${influencer.id}`}
                  >
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
    </>
  );
};

export default ListInfluencer;
