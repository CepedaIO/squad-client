import {useContext} from "react";
import AppContext from "../providers/AppContext";

export const useApp = () => useContext(AppContext);
