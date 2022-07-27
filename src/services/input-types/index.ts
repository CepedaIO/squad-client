type AssertionWithMessage<Value> = Tuple<Assertion<Value>, string>;

export const validateWith = <Value>(assertions: (Assertion<Value> | AssertionWithMessage<Value>)[]): (val:Value) => true | Tuple<false, string> => {
   return (val:Value) => {
      for(const assertion of assertions) {
         if(Array.isArray(assertion)) {
            const message: string = assertion[1] || assertion[0].message || 'N/A';
            if(!assertion[0](val)) {
               return [false, message];
            }
         } else {
            const message: string = assertion.message || 'N/A';
            if(!assertion(val)) {
               return [false, message];
            }
         }
      }

      return true;
   }
}
