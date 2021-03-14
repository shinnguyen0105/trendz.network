import gql from 'graphql-tag';

export const CREATE_CHANNEL = gql`
  mutation createChannel(
    $name: String!
    $description: String
    $category: ID!
    $phone: String
    $avatar: ID!
    $website: String
    $picture: [ID]
    $price: Long
    $user: ID
  ) {
    createChannel(
      input: {
        data: {
          name: $name
          description: $description
          website: $website
          phone: $phone
          avatar: $avatar
          picture: $picture
          price: $price
          category: $category
          user: $user
        }
      }
    ) {
      channel {
        id
        name
        status
      }
    }
  }
`;
