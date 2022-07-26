import {useContext} from "react";
import AppContext from "../providers/AppContext";

export const useApp = () => useContext(AppContext);
export const usePage = () => useApp().page;
