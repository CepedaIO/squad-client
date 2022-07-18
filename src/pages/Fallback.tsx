import {useContext, useEffect} from "react";
import {AppContext} from "../providers/AppProvider";

const Fallback = () => {
  const {
    nav: { navigateAnywhere }
  } = useContext(AppContext);

  useEffect(() => {
    navigateAnywhere();
  }, []);

  return (
    <div className="flex flex-col gap-12 items-center h-full">
      <h1 className="text-center">Loading ... </h1>

      <div className="mt-12">
        <img src="/cat.gif" />
      </div>
    </div>
  )
}

export default Fallback;
