import gql from 'graphql-tag';

export const REQUEST_UPDATE_ROLE = gql`
  mutation Updaterole($userId: ID!, $role: ID!) {
    updateUser(input: { where: { id: $userId }, data: { role: $role } }) {
      user {
        id
        username
        email
        role {
          name
          type
          description
        }
      }
    }
  }
`;
