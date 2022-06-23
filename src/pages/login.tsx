import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
  const emailInput = useRef<HTMLInputElement>(null);
  const codeInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate()

  const clickedLogin = async () => {
    const email = emailInput.current?.value;
    const code = codeInput.current?.value;
    console.log('login with:', email);

    navigate('/sign-up');
  };

  const clickedRegister = () => navigate('/register');

  return (
    <div className="p-5 flex flex-row">
      <div className="mx-auto flex flex-col gap-6">
        <input type="text" name="email" placeholder="Enter email" ref={emailInput} />
        <input type="text" name="code" placeholder="Enter auth code" ref={codeInput} />

        <div className="flex flex-row gap-5">
          <button className="primary mx-auto" onClick={clickedLogin}>Login</button>
          <button className="secondary" onClick={clickedRegister}>Register</button>
        </div>

      </div>
    </div>
  )
}

export default LoginPage;
