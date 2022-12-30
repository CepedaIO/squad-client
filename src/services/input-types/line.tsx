import {InputDescriptor} from "./index";
import {TextValidation} from "squad-shared";
import $c from "classnames";
import React from "react";
import Input from "../../components/inline/Input";

const Line: InputDescriptor<string> = {
  id: 'line',
  input: (props) =>  {
    return (
      <Input
        {...props }
        type={'text'}
        className={$c(props.className, 'p-2')}
        onChange={props.onChange}
      />
    )
  },
  ist: TextValidation.ist,
};

export default Line;
