import React, {useContext, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";
import {NotificationContext} from "../providers/NotificationProvider";
import {useValidator} from "../services/validate";
import Button from "../components/inline/Button";
import ErrorableInput from "../components/inline-block/ErrorableInput";

const RegisterPage = () => {
  const emailInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
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

  const clickedLogin = () => navigate('/login');

  const clickedSignUp = () =>
    setup({
      email: emailInput.current?.value as string,
    })
    .validateAndReport(({ assert }) => [
      assert('email', (val) => !!val && val.length > 2, 'Must be greater than 2 characters'),
    ])
    .then((variables) =>
      setLoading(true)//createAccount({ variables })
    )
    .catch(({ errors }) => {
      if(errors) {
        addNotice({
          id: 'RegisterPageError',
          message: 'Unable to sign up, check for errors',
          level: 'error'
        });
      }
    });

  return (
    <div className="p-5 flex flex-row">
      <div className="mx-auto flex flex-col gap-6 items-center w-full max-w-screen-sm">
        <h1>Register</h1>

        <ErrorableInput type="text" field="email" placeholder="Enter email" className="w-full" ref={emailInput} />

        <Button className="secondary w-full" onClick={clickedLogin}>Login</Button>
      </div>
    </div>
  )
}

export default RegisterPage;
