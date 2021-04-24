import gql from 'graphql-tag';

export const REQUEST_UPDATE_CAMPAIGN = gql`
  mutation updateCampaign(
    $id: ID!
    $title: String
    $content: String
    $category: ID
    $channels: [ID]
    $open_datetime: DateTime
    $close_datetime: DateTime
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
        }
      }
    ) {
      campaign {
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
  }
`;
export const REQUEST_UPDATE_CAMPAIGN_INFLUENCER = gql`
  mutation updateCampaignForInfluencer(
    $id: ID!
    $status: Boolean
    $InfluencerCompleted: Boolean
  ) {
    updateCampaign(
      input: {
        where: { id: $id }
        data: { status: $status, influencerCompleted: $InfluencerCompleted }
      }
    ) {
      campaign {
        id
        title
        content
        status
        completed
        influencerCompleted
        approve
        note
        created_at
        category {
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
            formats
          }
        }
        channels {
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
  }
`;
export const REQUEST_UPDATE_CAMPAIGN_BY_EMPLOYEE = gql`
  mutation updateCampaignForEmployee(
    $id: ID!
    $approve: Boolean
    $notee: String
    $complete: Boolean
  ) {
    updateCampaign(
      input: {
        where: { id: $id }
        data: { approve: $approve, note: $notee, completed: $complete }
      }
    ) {
      campaign {
        id
        title
        content
        status
        completed
        approve
        influencerCompleted
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
  }
`;
