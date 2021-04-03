import gql from 'graphql-tag';

export const UPDATE_CHANNEL_BY_INFLUENCER = gql`
  mutation updateChannelByInfluencer($id: ID!, $status: Boolean) {
    updateChannel(
      input: { where: { id: $id }, data: { employeeConfirm: $status } }
    ) {
      channel {
        id
        name
        website
        status
        employeeConfirm
        employeeNote
        adminConfirm
        adminNote
        price
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
      }
    }
  }
`;
export const UPDATE_CHANNEL_BY_ADMIN = gql`
  mutation updateChannelByAdmin(
    $id: ID!
    $adminConfirm: Boolean
    $status: Boolean
    $adminNote: String
  ) {
    updateChannel(
      input: {
        where: { id: $id }
        data: {
          adminConfirm: $adminConfirm
          status: $status
          adminNote: $adminNote
        }
      }
    ) {
      channel {
        id
        name
        website
        status
        employeeConfirm
        adminConfirm
        adminNote
        employeeNote
        price
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
      }
    }
  }
`;

export const UPDATE_CHANNEL_BY_EMPLOYEE = gql`
  mutation updateChannelByInfluencer(
    $id: ID!
    $status: Boolean
    $employeeNote: String
  ) {
    updateChannel(
      input: {
        where: { id: $id }
        data: { employeeConfirm: $status, employeeNote: $employeeNote }
      }
    ) {
      channel {
        id
        name
        website
        status
        employeeConfirm
        employeeNote
        adminConfirm
        adminNote
        price
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
      }
    }
  }
`;
