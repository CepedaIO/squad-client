import {InputDescriptor} from "./index";
import {TextValidation} from "squad-shared";

const Multiline: InputDescriptor<string> = {
  id: 'multiline',
  input: 'textarea',
  in: (val: string) => val,
  out: (val: string) => val,
  ist: TextValidation.ist
};

export default Multiline;
