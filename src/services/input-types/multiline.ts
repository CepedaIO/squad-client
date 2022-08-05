import {TypeDescriptor} from "./index";

const Multiline = {
  _type: {
    id: 'multiline',
    type: 'textarea',
    in: (val: string) => val,
    out: (val: string) => val
  } as TypeDescriptor<string>
};

export default Multiline;
