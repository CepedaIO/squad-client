import { test } from "./utils";

const extract = (regex: RegExp, classNames?: string) => (classNames || '')
  .split(' ')
  .reduce(([remaining, extracted], className) => {
    if(test(regex, className)) {
      extracted.push(className);
    } else {
      remaining.push(className);
    }

    return [remaining, extracted] as Tuple<string[]>;
  }, [[], []] as Tuple<string[]>)
.map((part) => part.join(' '))

export const extractWidths = (classNames?: string) => extract(/.*(w-).+/g, classNames);

export default extract;
