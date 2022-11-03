import {InputDescriptor} from "./index";
import {TextValidation} from "squad-shared";

const Line: InputDescriptor<string> = {
  id: 'line',
  input: 'text',
  in: (val: string) => val,
  out: (val: string) => val,
  ist: TextValidation.ist,
};

export default Line;
