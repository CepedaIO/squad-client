import {InputDescriptor} from "./index";

const Multiline = {
  _descriptor: {
    id: 'multiline',
    input: 'textarea',
    in: (val: string) => val,
    out: (val: string) => val
  } as InputDescriptor<string>
};

export default Multiline;
