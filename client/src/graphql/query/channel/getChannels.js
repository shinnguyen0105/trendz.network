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
        id
        url
        formats
      }
      category {
        id
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
        id
        url
        formats
      }
      category {
        id
        name
      }
      status
      adminConfirm
      employeeConfirm
      created_at
    }
  }
`;
export const REQUEST_ALL_CHANNELS_TO_COUNT = gql`
  query getAllChannelToCount {
    channels {
      id
      name
    }
  }
`;
export const REQUEST_GET_CHANNEL_DETAILS = gql`
  query getChannelDetails($channelID: ID!) {
    channel(id: $channelID) {
      id
      name
      website
      status
      employeeConfirm
      adminConfirm
      price
      adminNote
      employeeNote
      category {
        id
        name
        description
      }
      avatar {
        id
        formats
        url
      }
      picture {
        id
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
          id
          formats
          url
        }
      }
    }
  }
`;
