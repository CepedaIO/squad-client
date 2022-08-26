import {gql, useMutation} from "@apollo/client";

export const useLogin = () => useMutation(gql`
  mutation Login($email: String!) {
    login(email: $email) {
      success,
      result
    }
  }
`);

export const useLoginToken = () => useMutation(gql`
  mutation UseLoginToken($token: String!, $uuid: String!, $expires: Int!) {
    useLoginToken(token: $token, uuid: $uuid, expires: $expires) {
      success
    }
  }
`);
