import gql from 'graphql-tag';

export const UPDATE_CHANNEL = gql`
  mutation updateChannel(
    $id: ID!
    $name: String
    $description: String
    $category: ID
    $phone: String
    $website: String
    $price: Long
  ) {
    updateChannel(
      input: {
        where: { id: $id }
        data: {
          name: $name
          description: $description
          website: $website
          phone: $phone
          price: $price
          category: $category
          status: null
          employeeConfirm: null
          adminConfirm: null
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
