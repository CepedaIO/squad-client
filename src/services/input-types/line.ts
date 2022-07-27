const Line = {
  _type: {
    id: 'line',
    type: 'text',
    in: (val: string) => val,
    out: (val: string) => val
  } as TypeDescriptor<string>
};

export default Line;
