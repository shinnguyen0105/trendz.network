import gql from 'graphql-tag';

export const REQUEST_GET_MESSAGE_CAMPAIGN = gql`
  query getMessage($id: ID!) {
    messages(where: { campaign: { id: $id } }) {
      id
      userMessage
      influencerMessage
      created_at
    }
  }
`;
