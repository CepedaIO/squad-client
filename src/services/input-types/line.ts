import {TypeDescriptor} from "./index";

const Line = {
  _descriptor: {
    id: 'line',
    input: 'text',
    in: (val: string) => val,
    out: (val: string) => val
  } as TypeDescriptor<string>,
  defined: (value?: string) => !!value,
  greaterThan: (offset: number) => (value: string) => value.length > offset,
};

export default Line;
