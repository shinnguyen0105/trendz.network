import gql from 'graphql-tag';

export const REQUEST_GET_ALL_CATEGORIES = gql`
  query getAllCategories {
    categories {
      id
      name
    }
  }
`;
