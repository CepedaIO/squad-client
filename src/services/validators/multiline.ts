const Multiline:TypeDescriptor<string> = {
  id: 'multiline',
  type: 'textarea',
  in: (val: string) => val,
  out: (val: string) => val
};

export default Multiline;
