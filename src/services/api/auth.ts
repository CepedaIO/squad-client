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
  mutation UseLoginToken($key: String!, $uuid: String!, $expires: Int!) {
    useLoginToken(key: $key, uuid: $uuid, expires: $expires) {
      success
    }
  }
`);
