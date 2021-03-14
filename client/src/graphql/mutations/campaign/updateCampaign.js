import gql from 'graphql-tag';

export const UPDATE_CAMPAIGN = gql`
  mutation updateCampaign(
    $id: ID!
    $title: String
    $content: String
    $category: ID
    $channels: [ID]
    $open_datetime: Date
    $close_datetime: Date
  ) {
    updateCampaign(
      input: {
        where: { id: $id }
        data: {
          title: $title
          content: $content
          category: $category
          channels: $channels
          campaignTTL: {
            open_datetime: $open_datetime
            close_datetime: $close_datetime
          }
          status: null
          approve: null
          completed: null
        }
      }
    ) {
      campaign {
        id
        title
        content
        status
        approve
        completed
        category {
          id
          name
        }
        channels {
          id
          name
        }
        campaignTTL {
          open_datetime
          close_datetime
        }
      }
    }
  }
`;
