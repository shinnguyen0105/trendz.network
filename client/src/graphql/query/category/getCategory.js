import gql from 'graphql-tag';

export const REQUEST_GET_ALL_CATEGORIES = gql`
  query getAllCategories {
    categories {
      id
      name
    }
  }
`;
export const REQUEST_GET_ALL_CATEGORIES_CHANNELS = gql`
  query getAllCategoriesAndChannel {
    categories {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;
