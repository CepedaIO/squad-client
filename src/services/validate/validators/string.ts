const greaterThan = (gt: number) => (val: string) => [
  {
    valid: !!val && val.length > gt,
    message: `Must be greater than ${gt}`
  }
]

const StringValidators = {
  greaterThan
}

export default StringValidators;
