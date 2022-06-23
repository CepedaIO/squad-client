import React, {useContext, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";
import {INotificationContext, NotificationContext} from "../App";

const RegisterPage = () => {
  const emailInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addNotice } = useContext<INotificationContext>(NotificationContext)

  const [ createAccount, { data, loading} ] = useMutation(gql`
    mutation CreateAccount($account: AccountInput!) {
      createAccount(account: $account) {
        success,
        result
      }
    }
  `);

  useEffect(() => {
    debugger;
    addNotice({
      id: 'mmocow',
      message: 'The fuck you trying to sign up for? GTFO',
      level: 'warning'
    })

    addNotice({
      id: 'another',
      message: 'The fuck you trying to sign up for? GTFO',
      level: 'info'
    })

    addNotice({
      id: 'another1',
      message: 'The fuck you trying to sign up for? GTFO',
      level: 'error'
    })

    addNotice({
      id: 'another3',
      message: 'The fuck you trying to sign up for? GTFO',
      level: 'success'
    })
  }, [true]);

  const clickedLogin = () => navigate('/login');

  const clickedSignUp = () => {
    const id = emailInput.current?.value as string;
    addNotice({
      id,
      message: 'The fuck you trying to sign up for? GTFO',
      level: 'warning'
    })
    /*
    addNotice({
      id: 'Moocow',
      message: 'Wow really?!?',
      level: 'info'
    })*/
  };
  /*
  const clickedSignUp = () => createAccount({
    variables: {
      email: emailInput.current?.value
    }
  });*/

  return (
    <div className="p-5 flex flex-row">
      <div className="mx-auto flex flex-col gap-6">
        <input type="text" name="email" placeholder="Enter email" ref={emailInput} />

        <div className="flex flex-row gap-5">
          <button className="primary mx-auto" onClick={clickedSignUp}>Sign-Up</button>
          <button className="secondary" onClick={clickedLogin}>Login</button>
        </div>

      </div>
    </div>
  )
}

export default RegisterPage;
