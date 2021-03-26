import gql from 'graphql-tag';

export const REQUEST_GET_ALL_INFLUENCERS = gql`
  query getAllInfluencers {
    users(where: { role: { name: "Influencer" } }) {
      id
      name
      avatar {
        formats
      }
      role {
        name
      }
    }
  }
`;
export const REQUEST_GET_INFLUENCER_DETAILS = gql`
  query getInfluencerDetails($influencerID: ID!) {
    channels(where: { user: { id: $influencerID } }) {
      id
      name
      website
      status
      price
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
