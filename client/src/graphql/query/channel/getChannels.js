import gql from 'graphql-tag';

export const REQUEST_GET_ALL_CATEGORIES_CHANNELS = gql`
  query getAllCategoriesAndChannels {
    categories {
      id
      name
      channels {
        id
        name
        status
      }
    }
  }
`;

export const REQUEST_GET_CHANNEL_DETAILS = gql`
  query getChannelDetails($channelID: ID!) {
    channels(where: { id: $channelID }) {
      id
      name
      website
      status
      employeeConfirm
      adminConfirm
      price
      category {
        id
        name
        description
      }
      avatar {
        formats
        url
      }
      picture {
        formats
        url
      }
      user {
        id
        name
        username
        email
        phoneNumber
        avatar {
          formats
          url
        }
      }
    }
  }
`;
