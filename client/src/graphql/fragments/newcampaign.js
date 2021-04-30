import gql from 'graphql-tag';

export const CREATE_CAMPAIGN_FRAGMENT = gql`
  fragment NewCampaign on Campaign {
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
`;
