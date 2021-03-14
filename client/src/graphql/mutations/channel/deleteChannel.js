import gql from 'graphql-tag';

export const CREATE_CHANNEL = gql`
  mutation deleteCampaign($id: ID!) {
    deleteCampaign(input: { where: { id: $id } }) {
      campaign {
        id
      }
    }
  }
`;
