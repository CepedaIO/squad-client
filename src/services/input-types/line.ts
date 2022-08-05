import {TypeDescriptor} from "./index";

const Line = {
  _type: {
    id: 'line',
    type: 'text',
    in: (val: string) => val,
    out: (val: string) => val
  } as TypeDescriptor<string>,
  defined: (value?: string) => !!value,
  greaterThan: (offset: number) => (value: string) => value.length > offset,
};

export default Line;
