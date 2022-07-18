import Button from "../components/inline/Button";
import {useNavigate} from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
  <main>
    <Button variant={"submit"} onClick={() => navigate('/group/new')}>New Events</Button>
  </main>
  )
}

export default Home;
