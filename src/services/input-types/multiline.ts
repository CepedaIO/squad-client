import {TypeDescriptor} from "./index";

const Multiline = {
  _descriptor: {
    id: 'multiline',
    input: 'textarea',
    in: (val: string) => val,
    out: (val: string) => val
  } as TypeDescriptor<string>
};

export default Multiline;
