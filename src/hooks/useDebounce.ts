import {debounce, DebounceSettingsLeading, DebouncedFunc} from "lodash";
import {useMemo, useState} from "react";

const useDebounce = <T extends (...args: any) => any>(func: T, wait: number, options?: DebounceSettingsLeading): DebouncedFunc<T> => {
  const [val, setVal] = useState();
  return useMemo(() => debounce((...args: ArgsType<T>[]) => {
    const newVal = func.apply(null, args);
    
    if(newVal !== val) {
      setVal(newVal);
    }
    
    return newVal;
  }, wait, options), [wait, options]);
}

export default useDebounce;
