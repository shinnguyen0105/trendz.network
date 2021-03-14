import gql from 'graphql-tag';

export const DELETE_CAMPAIGN = gql`
  mutation deleteCampaign($id: ID!) {
    deleteCampaign(input: { where: { id: $id } }) {
      campaign {
        id
      }
    }
  }
`;
