import {useContext, useEffect, useState} from "react";
import AppContext from "../providers/AppContext";
import {FieldValidation} from "../services/validate";

const useValidate = <S>(rules: Keyed<FieldValidation[]>): [boolean, () => void] => {
  const [errors, setErrors] = useState<FieldValidation[]>([]);
  const {
    err: {addErrors, removeErrors, hasError}
  } = useContext(AppContext);

  useEffect(() => {
    const keys = Object.keys(rules);
    if(hasError(keys)) {
      removeErrors(keys);
    }

    Object.entries(rules)
    .forEach(([key, validators]) => {
      const invalid = validators.filter(([valid]) => !valid);

      if(invalid.length > 0) {
        setErrors((prev) => prev.concat(
          invalid.map(([valid, message]) => ({
            field: key, valid, message
          }))
        ));
      }
    });
  }, [rules]);

  return [
    errors.length === 0,
    () => addErrors(errors)
  ];
}

export default useValidate;
