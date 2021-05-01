import gql from 'graphql-tag';

export const UPDATE_CAMPAIGN_FRAGMENT = gql`
  fragment NewCampaign on Campaign {
    id
    title
    content
    price
    status
    completed
    approve
    price
    note
    category {
      id
      name
      description
    }
    messages {
      id
      userMessage
      influencerMessage
      created_at
    }
    user {
      id
      name
      birthDay
      email
      address
      phoneNumber
      avatar {
        formats
      }
    }
    channels {
      id
      name
      phone
      address
      website
      user {
        id
        name
        role {
          name
        }
        avatar {
          formats
        }
        gender
        birthDay
        email
        address
        phoneNumber
      }
    }
    picture {
      formats
      url
    }
    campaignTTL {
      open_datetime
      close_datetime
    }
  }
`;
