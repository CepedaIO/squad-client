import {useContext, useEffect} from "react";
import {NavigationContext} from "../providers/NavigationProvider";

const Fallback = () => {
  const { navigateAnywhere } = useContext(NavigationContext);

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
