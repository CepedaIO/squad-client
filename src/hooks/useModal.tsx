import {useContext} from "react";
import {ModalContext} from "../providers/modalProvider";

const useModal = () => {
  const { show, result } = useContext(ModalContext);


  return [result, show];
}

export default useModal;
