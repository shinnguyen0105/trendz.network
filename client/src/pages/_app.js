import React from 'react';
import Head from 'next/head';
import withApollo from '../utils/ApolloSetup/withApollo';
import { ApolloProvider } from 'react-apollo';

import { UserContextProvider } from '../contexts/userContext';

import { SnackbarProvider } from 'notistack';
import Layout from '../components/Layout/Layout';

import '../assets/vendor/nucleo/css/nucleo.css';
import '../assets/vendor/font-awesome/css/font-awesome.min.css';
import '../assets/scss/argon-design-system-react.scss?v1.1.0';

const App = ({ Component, pageProps, apolloClient, router }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <title>Trendz Network</title>

        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
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
