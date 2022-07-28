

export const validateWith = <Values extends Keyed, Field extends keyof Values>(assertions: (Assertion<Values[Field]> | AssertionWithMessage<Values[Field]>)[]): (val:Values[Field]) => true | Tuple<false, string> => {
   return (val:Values[Field]) => {
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
