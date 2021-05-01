import gql from 'graphql-tag';

export const CREATE_CAMPAIGN = gql`
  mutation createCampaign(
    $title: String!
    $content: String!
    $price: Long!
    $picture: [ID!]
    $user: ID!
    $category: ID!
    $channels: [ID!]
    $open_datetime: DateTime!
    $close_datetime: DateTime!
  ) {
    createCampaign(
      input: {
        data: {
          title: $title
          content: $content
          price: $price
          picture: $picture
          user: $user
          status: null
          completed: null
          approve: null
          category: $category
          channels: $channels
          campaignTTL: {
            open_datetime: $open_datetime
            close_datetime: $close_datetime
          }
        }
      }
    ) {
      campaign {
        id
        title
        status
        completed
        influencerCompleted
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
  }
`;
