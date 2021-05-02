import gql from 'graphql-tag';

export const UPDATE_CHANNEL_FRAGMENT = gql`
  fragment NewChannel on Channel {
    id
    name
    website
    status
    employeeConfirm
    adminConfirm
    price
    adminNote
    employeeNote
    phone
    category {
      id
      name
      description
    }
    avatar {
      id
      formats
      url
    }
    picture {
      id
      formats
      url
    }
    user {
      id
      name
      username
      email
      phoneNumber
      avatar {
        id
        formats
        url
      }
    }
  }
`;
