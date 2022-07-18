import React, {useContext, useEffect, useRef} from "react";
import {gql, useMutation} from "@apollo/client";
import {NotificationContext} from "../providers/NotificationProvider";
import {useValidator} from "../services/validate";
import Button from "../components/inline/Button";
import ErrorableInput from "../components/inline-block/ErrorableInput";
import {AuthContext} from "../providers/AuthProvider";
import {NavigationContext} from "../providers/NavigationProvider";

const Login = () => {
  const emailInput = useRef<HTMLInputElement>(null);
  const { addNotice, handleUnexpected, removeNotice } = useContext(NotificationContext);
  const { setAuthToken } = useContext(AuthContext);
  const { navigate } = useContext(NavigationContext);
  const { setup } = useValidator();

  const [mutLogin, { data, error, loading } ] = useMutation(gql`
    mutation Login($email: String!) {
      login(email: $email) {
        success,
        result
      }
    }
  `);

  useEffect(() => {
    handleUnexpected(error)
  }, [error]);

  useEffect(() => {
    if(data?.login?.success) {
      debugger;
      setAuthToken(data.login.result);
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
    .then((variables) => mutLogin({ variables }))
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
          <Button variant={"submit"} loading={loading} className="w-full" onClick={clickedLogin}>Login</Button>
          <div className="text-xs text-hint mt-2">
            This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
