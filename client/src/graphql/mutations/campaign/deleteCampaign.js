import gql from 'graphql-tag';

export const REQUEST_DELETE_CAMPAIGN = gql`
  mutation deleteCampaign($id: ID!) {
    deleteCampaign(input: { where: { id: $id } }) {
      campaign {
        id
      }
    }
  }
`;
