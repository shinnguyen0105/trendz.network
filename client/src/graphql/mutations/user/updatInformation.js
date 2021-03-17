import gql from 'graphql-tag';

export const UPDATE_USER = gql`
  mutation updateUserProfile(
    $id: ID!
    $name: String
    $address: String
    $gender: String
    $phone: String
    $birthDate: Date
  ) {
    updateUser(
      input: {
        where: { id: $id }
        data: {
          name: $name
          address: $address
          gender: $gender
          phoneNumber: $phone
          birthDay: $birthDate
        }
      }
    ) {
      user {
        id
        name
        address
        gender
        phoneNumber
        birthDay
      }
    }
  }
`;
