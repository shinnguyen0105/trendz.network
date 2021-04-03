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
  query getAllCampaigns {
    campaigns {
      id
      title
      user {
        id
        name
      }
      status
      completed
      approve
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
//Get campaign by id
export const REQUEST_GET_DETAIL_CAMPAIGNS_BY_ID = gql`
  query getCampaignByCampaignID($id: ID!) {
    campaign(id: $id) {
      id
      title
      content
      status
      completed
      approve
      note
      category {
        id
        name
      }
      user {
        id
        name
        birthDay
        email
        address
        phoneNumber
        avatar {
          id
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
            id
            name
          }
          avatar {
            id
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
//get campaign-detail
export const REQUEST_GETCAMPAIGNS_DETAILS_BY_CAMPAIGN_ID = gql`
  query getCampaignDetails($id: ID!) {
    campaignDetail(id: $id) {
      campaign {
        id
        title
      }
      rating
      report
      chatLog {
        id
        userMessage
        influencerMessage
      }
    }
  }
`;
