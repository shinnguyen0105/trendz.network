import React from 'react';
import Head from 'next/head';
import withApollo from '../utils/ApolloSetup/withApollo';
import { ApolloProvider } from 'react-apollo';

import { UserContextProvider } from '../contexts/userContext';

import { SnackbarProvider } from 'notistack';
import Layout from '../components/Layout/Layout';

import '../assets/css/blk-design-system-react.css';
import '../assets/css/demo.css';
import '../assets/css/nucleo-icons.css';
import '../assets/vendor/font-awesome/css/font-awesome.min.css';

const App = ({ Component, pageProps, apolloClient, router }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <title>Trendz Network</title>

        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta
          http-equiv='Content-Security-Policy'
          content='upgrade-insecure-requests'
        ></meta>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Staatliches'
        />
      </Head>
      <UserContextProvider>
        <SnackbarProvider>
          <Layout>
            <Component {...pageProps} key={router.route} />
          </Layout>
        </SnackbarProvider>
      </UserContextProvider>
    </ApolloProvider>
  );
};

// Wraps all components in the tree with the data provider
export default withApollo(App);
