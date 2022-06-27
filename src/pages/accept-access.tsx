import {useParams} from "react-router-dom";

const AcceptAccess = () => {
  const { token, key } = useParams();

  return (
    <>
      <h1>Accepting access!</h1>
      <h2>Token: {token}</h2>
      <h2>Key: {key}</h2>
    </>
  )
}

export default AcceptAccess;
