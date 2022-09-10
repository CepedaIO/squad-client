import {client} from "./utils";
import {gql} from "@apollo/client";

export const deleteTestData = () => cy.wrap(
  client.mutate({
    mutation: gql`
      mutation DeleteTestData {
        deleteTestData {
          success
          result
        }
      }
    `,
  })
);

export const loginTestUser = (email: string) => cy.wrap(
  client.mutate({
    mutation: gql`
      mutation LoginTestUser($email: String!) {
        loginTestUser(email: $email) {
          success
          result
        }
      }
    `,
    variables: { email }
  }).then((resp) => {
    window.localStorage.setItem('auth', resp.data.loginTestUser.result);
  })
)
