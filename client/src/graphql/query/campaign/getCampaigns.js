import gql from 'graphql-tag';

//Influencer get campaign for our channel
export const REQUEST_GET_CAMPAIGNS_BY_INFLUENCER_ID = gql`
  query getCampaignByInfluencerID($idInfluencer: ID!, $sort: String) {
    campaigns(
      where: { channels: { user: { id: $idInfluencer } } }
      sort: $sort
    ) {
      id
      title
      status
      completed
      approve
      price
      category {
        id
        name
      }
      user {
        id
        name
      }
      channels {
        user {
          id
        }
      }
      picture {
        id
        formats
        url
      }
      campaignTTL {
        id
        open_datetime
        close_datetime
      }
    }
  }
`;
//Customer get our campaign
export const REQUEST_GET_MY_CAMPAIGNS = gql`
  query getCampaignByCustomerID($idCustomer: ID!, $sort: String) {
    campaigns(where: { user: { id: $idCustomer } }, sort: $sort) {
      id
      title
      status
      completed
      price
      approve
      category {
        id
        name
      }
      user {
        id
        name
      }
      picture {
        id
        formats
        url
      }
      campaignTTL {
        id
        open_datetime
        close_datetime
      }
    }
  }
`;
// Get all id of campaigns collection
export const REQUEST_GET_ID_CAMPAIGNS = gql`
  query getID {
    campaigns {
      id
    }
  }
`;
export const REQUEST_GET_ALL_CAMPAIGNS = gql`
  query getAllCampaigns($sort: String) {
    campaigns(sort: $sort) {
      id
      title
      user {
        id
        name
      }
      status
      completed
      price
      approve
      influencerCompleted
      picture {
        id
        formats
      }
      category {
        id
        name
      }
      campaignTTL {
        id
        open_datetime
        close_datetime
      }
    }
  }
`;
export const REQUEST_GET_ALL_CAMPAIGNS_TO_COUNT = gql`
  query getAllCampaignToCount {
    campaigns {
      id
      title
      created_at
    }
  }
`;
//Get campaign by id
export const REQUEST_GET_DETAIL_CAMPAIGNS_BY_ID = gql`
  query getCampaignByCampaignID($id: ID!) {
    campaign(id: $id) {
      id
      title
      content
      status
      completed
      price
      approve
      note
      influencerCompleted
      created_at
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
  }
`;
