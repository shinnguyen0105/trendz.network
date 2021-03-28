import gql from 'graphql-tag';

export const REQUEST_GET_MY_CHANNELS = gql`
  query getAllChannelForInfluencer($influencerID: ID!) {
    channels(where: { user: { id: $influencerID } }) {
      id
      name
      user {
        id
      }
      avatar {
        url
        formats
      }
      category {
        name
      }
      status
      adminConfirm
      employeeConfirm
      created_at
    }
  }
`;
export const REQUEST_ALL_CHANNELS = gql`
  query getAllChannel {
    channels {
      id
      name
      user {
        id
      }
      avatar {
        url
        formats
      }
      category {
        name
      }
      status
      adminConfirm
      employeeConfirm
      created_at
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
