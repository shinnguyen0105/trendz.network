import gql from 'graphql-tag';

export const REQUEST_SEND_CHAT_BY_INFLUENCER = gql`
  mutation createChatForInfluencer($input: String!, $campaign: ID!) {
    createMessage(
      input: { data: { campaign: $campaign, influencerMessage: $input } }
    ) {
      message {
        id
        userMessage
        influencerMessage
        created_at
      }
    }
  }
`;
export const REQUEST_SEND_CHAT_BY_CUSTOMER = gql`
  mutation createChatForCustomer($input: String, $campaign: ID!) {
    createMessage(
      input: { data: { campaign: $campaign, userMessage: $input } }
    ) {
      message {
        id
        userMessage
        influencerMessage
        created_at
      }
    }
  }
`;
