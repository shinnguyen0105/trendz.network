import React from 'react';
import { Card, Container, CardTitle, CardText, Button } from 'reactstrap';

import Link from 'next/link';

const ErrorPage = () => {
  return (
    <div className='wrapper'>
      <div className='main'>
        <br />
        <br />
        <Card>
          <Container>
            <Card className='single-card'>
              <CardTitle>404 Error</CardTitle>
              <br />
              <CardText>Your path is currently unavailable.</CardText>
              <Link href='/dashboard'>
                <Button>Return to home page</Button>
              </Link>
            </Card>
          </Container>
        </Card>
      </div>
    </div>
  );
};

export default ErrorPage;
