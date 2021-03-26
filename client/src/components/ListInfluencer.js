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
const { API_URL } = process.env;

const ListInfluencer = ({ data }) => {
  console.log(data);
  return (
    <>
      <Row>
        <CardDeck>
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
                    <Skeleton variant='rect' width={256} height={186} />
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
    </>
  );
};

export default ListInfluencer;
