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
