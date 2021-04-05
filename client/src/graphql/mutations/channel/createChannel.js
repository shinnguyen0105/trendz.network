import gql from 'graphql-tag';

export const CREATE_CHANNEL = gql`
  mutation createChannel(
    $name: String!
    $description: String
    $address: String
    $website: String
    $category: ID!
    $phone: String
    $avatar: ID!
    $price: Long
    $user: ID
  ) {
    createChannel(
      input: {
        data: {
          name: $name
          description: $description
          address: $address
          website: $website
          phone: $phone
          avatar: $avatar
          price: $price
          category: $category
          user: $user
        }
      }
    ) {
      channel {
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
    }
  }
`;
