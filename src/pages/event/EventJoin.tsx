import Cat from "../../components/Cat";
import {useParams} from "react-router-dom";

const EventJoin = () => {
  const { id, key, uuid } = useParams();

  console.log(id, key, uuid);
  return (
    <div className="flex flex-col gap-12 items-center h-full">
      <h1 className="text-center">Joining event ... </h1>

      <div className="mt-12">
        <Cat />
      </div>
    </div>
  )
};

export default EventJoin;
