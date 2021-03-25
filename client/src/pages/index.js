import React, { useEffect } from 'react';

import { Container } from 'reactstrap';

import Router, { withRouter } from 'next/router';
import { useAuth } from '../contexts/userContext';

const Home = () => {
  const { state } = useAuth();

  useEffect(() => {
    if (state.jwt === '') return;
    Router.push('/dashboard');
  }, [state]);
  return (
    <div>
      <Container>
        <div className='page-header header-filter'>
          <div className='content-center brand'>
            <h1 className='h1-seo'>Trendz Network</h1>
            <h3 className='d-none d-sm-block'>Awesome network</h3>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default withRouter(Home);
