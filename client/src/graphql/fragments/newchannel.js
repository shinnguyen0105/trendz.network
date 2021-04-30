import gql from 'graphql-tag';

export const CREATE_CHANNEL_FRAGMENT = gql`
  fragment NewChannel on Channel {
    id
    name
    user {
      id
    }
    avatar {
      id
      url
      formats
    }
    category {
      id
      name
    }
    status
    adminConfirm
    employeeConfirm
    created_at
  }
`;
