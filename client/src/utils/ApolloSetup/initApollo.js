import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import fetch from 'isomorphic-unfetch';
import { setContext } from '@apollo/client/link/context';

let apolloClient = null;

if (typeof window === 'undefined') {
  global.fetch = fetch;
}

const create = (initialState, headers) => {
  const isBrowser = typeof window !== 'undefined';

  const httpLink = new HttpLink({
    uri:
      process.env.API_URL + '/graphql' || 'http://103.82.25.142:1337/graphql',
  });
  console.log(process.env.API_URL);
  const authLink = setContext((_, previousContext) => {
    const cachedData = JSON.parse(localStorage.getItem('userInfo') || '');
    const token = cachedData.jwt;
    return {
      headers: Object.assign(Object.assign({}, headers), {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      }),
    };
  });

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export default function initApollo(initialState, headers) {
  if (typeof window === 'undefined') {
    return create(initialState, headers);
  }

  if (!apolloClient) {
    apolloClient = create(initialState, headers);
  }
  return apolloClient;
}
