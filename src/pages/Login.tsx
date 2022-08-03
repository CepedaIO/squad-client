import React, {useContext, useEffect, useMemo, useRef} from "react";
import {gql, useMutation} from "@apollo/client";
import Button from "../components/inline/Button";
import AppContext from "../providers/AppContext";
import Line from "../services/input-types/line";
import FormContext, {createFormContext} from "../providers/FormContext";
import {useForm} from "../hooks/useForm";

interface ILoginForm {
  email: string;
}

const LoginPage = () => {
  const {
    auth: { setAuthToken },
    nav: { navigate },
    notif: { addNotice, handleUnexpected, removeNotice }
  } = useContext(AppContext);

  const { validate, FormInput } = useForm<ILoginForm>()

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
      setAuthToken(data.login.result);
      navigate('/awaiting-access');
    }
  }, [data])

  const clickedLogin = () => {
    removeNotice('RegisterPageError')
    const [isValid, { email }] = validate();
    if(isValid) {
      return mutLogin({
        variables: {
          email
        }
      });
    }

    addNotice({
      id: 'RegisterPageError',
      message: 'Unable to login, please fix errors',
      level: 'error'
    });
  }

  return (
      <div className="flex flex-col h-full justify-center">
        <div className="mx-auto flex flex-col gap-6 w-full max-w-screen-sm">
          <h1>
            Welcome!
            { loading && (<i className="fa-solid fa-yin-yang fa-spin ml-3" />)}
          </h1>

          <FormInput
            type={Line}
            label={"Email:"}
            field={"email"}
            placeholder={"Enter email"}
            className={"w-full"}
            validator={() => [
              [Line.defined, 'Must enter an email'],
              [Line.greaterThan(3), 'Email must be greater than 3 characters']
            ]}
          />

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

export const Login = () => (
  <FormContext.Provider value={createFormContext<ILoginForm>({
    email: ''
  })}>
    <LoginPage />
  </FormContext.Provider>
)

export default Login;
