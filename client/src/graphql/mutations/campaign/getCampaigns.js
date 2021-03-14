import gql from 'graphql-tag';

//Influencer get campaign for our channel
export const REQUEST_GET_CAMPAIGNS_BY_INFLUENCER_ID = gql`
  query getCampaignByInfluencerID($idInfluencer: ID!) {
    campaigns(where: { channels: { user: { id: $idInfluencer } } }) {
      id
      title
      status
      completed
      approve
      user {
        name
      }
      channels {
        user {
          id
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
//Customer get our campaign
export const REQUEST_GET_MY_CAMPAIGNS = gql`
  query getCampaignByCustomerID($idCustomer: ID!) {
    campaigns(where: { user: { id: $idCustomer } }) {
      id
      title
      status
      completed
      approve
      user {
        name
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
// Get all id of campaigns collection
export const REQUEST_GET_ID_CAMPAIGNS = gql`
  query getID {
    campaigns {
      id
    }
  }
`;
//Get campaign by id
export const REQUEST_GET_DETAIL_CAMPAIGNS_BY_ID = gql`
  query getCampaignByCampaignID($id: ID!) {
    campaigns(where: { id: $id }) {
      id
      title
      content
      status
      completed
      approve
      note
      user {
        id
        name
        birthDay
        email
        address
        phoneNumber
      }
      channels {
        name
        description
        user {
          id
          name
          role {
            name
          }
        }
        phone
        address
        website
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
