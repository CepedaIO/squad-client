import {InputDescriptor} from "./index";
import {TextValidation} from "event-matcher-shared";

const Line: InputDescriptor<string> = {
  id: 'line',
  input: 'text',
  in: (val: string) => val,
  out: (val: string) => val,
  ist: TextValidation.ist,
};

export default Line;
