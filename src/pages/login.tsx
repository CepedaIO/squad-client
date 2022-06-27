import React, {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";
import {NotificationContext} from "../providers/NotificationProvider";
import {useValidator} from "../services/validate";
import Button from "../components/inline/Button";
import ErrorableInput from "../components/inline-block/ErrorableInput";

const LoginPage = () => {
  const emailInput = useRef<HTMLInputElement>(null);
  const { addNotice, handleUnexpected, removeNotice } = useContext(NotificationContext)
  const { setup } = useValidator();
  const navigate = useNavigate();

  const [doLogin, { data, error, loading } ] = useMutation(gql`
    mutation Login($login: LoginInput!) {
      login(auth: $login) {
        success,
        result
      }
    }
  `);

  useEffect(() => {
    handleUnexpected(error)
  }, [error]);

  useEffect(() => {
    if(data && data.login) {
      navigate('/awaiting-access');
    }
  }, [data])

  const clickedLogin = () =>
    setup({
      email: emailInput.current?.value as string,
    })
    .effect(() => removeNotice('RegisterPageError'))
    .validateAndReport(({ assert }) => [
      assert('email', (val) => !!val && val.length > 2, 'Must be greater than 2 characters'),
    ])
    .then((login) => doLogin({
      variables: { login }
    }))
    .catch(({ errors }) => {
      if(errors) {
        addNotice({
          id: 'RegisterPageError',
          message: 'Unable to login, please fix errors',
          level: 'error'
        });
      }
    });

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="mx-auto flex flex-col gap-6 w-full max-w-screen-sm">
        <h1>
          Welcome!
          { loading && (<i className="fa-solid fa-yin-yang fa-spin ml-3" />)}
        </h1>
        <ErrorableInput type="text" field="email" placeholder="Enter email" className="w-full" ref={emailInput} />

        <div>
          <Button variant="primary" className="w-full" disabled={loading} onClick={clickedLogin}>Login</Button>
          <div className="text-xs text-hint mt-2">
            This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;
