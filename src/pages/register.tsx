import React, {useContext, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";
import ErrorOutput from "../components/ErrorOutput";
import {INotificationContext, NotificationContext} from "../providers/NotificationProvider";
import {ErrorContext} from "../providers/ErrorProvider";
import {assert, useValidator} from "../services/validate";
import {ErrorZone} from "../components/ErrorZone";

const RegisterPage = () => {
  const emailInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addNotice } = useContext(NotificationContext)
  const { addErrors, removeError } = useContext(ErrorContext);
  const { errors, setup } = useValidator();
  useEffect(() => {
    addNotice({
      id: 'test',
      message: 'hello?',
      level: 'error'
    });
  }, [true]);

  const [ createAccount, { data, loading} ] = useMutation(gql`
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
      age: 7
    }).validateAndReport(({ assert }) => [
      assert('age', (val) => val > 12, 'Age must be greater than 12'),
      assert('email', (val) => !!val && val.length > 2, 'Email must be greater than 2 characters'),
    ]);

  return (
    <div className="p-5 flex flex-row">
      <div className="mx-auto flex flex-col gap-6">
        <ErrorZone field="email">
          <input type="text" name="email" placeholder="Enter email" ref={emailInput} />
          <ErrorOutput />
        </ErrorZone>

        <div className="flex flex-row gap-5">
          <button className="primary mx-auto" onClick={clickedSignUp}>Sign-Up</button>
          <button className="secondary" onClick={clickedLogin}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage;
