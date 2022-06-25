import React, {useContext, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";
import {NotificationContext} from "../providers/NotificationProvider";
import {useValidator} from "../services/validate";
import Button from "../components/inline/Button";
import ErrorableInput from "../components/inline-block/ErrorableInput";

const LoginPage = () => {
  const emailInput = useRef<HTMLInputElement>(null);
  const { addNotice } = useContext(NotificationContext)
  const { setup } = useValidator();
  const [loading, setLoading] = useState(false);

  const [ createAccount, { data } ] = useMutation(gql`
    mutation CreateAccount($account: AccountInput!) {
      createAccount(account: $account) {
        success,
        result
      }
    }
  `);

  const clickedLogin = () =>
    setup({
      email: emailInput.current?.value as string,
    })
    .validateAndReport(({ assert }) => [
      assert('email', (val) => !!val && val.length > 2, 'Must be greater than 2 characters'),
    ])
    .then((variables) => {
      console.log(variables)
      setLoading(true)//createAccount({ variables })
    })
    .catch(({ errors }) => {
      if(errors) {
        addNotice({
          id: 'RegisterPageError',
          message: 'Unable to login, check for errors',
          level: 'error'
        });
      }
    });

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="mx-auto flex flex-col gap-6 w-full max-w-screen-sm">
        <h1>Welcome!</h1>
        <ErrorableInput type="text" field="email" placeholder="Enter email" className="w-full" ref={emailInput} />

        <div>
          <Button className="primary w-full" onClick={clickedLogin}>Login</Button>
          <div className="text-xs text-hint mt-2">
            This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;
