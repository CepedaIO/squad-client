const extractWidths = (classNames: string) => classNames
  .split(' ')
  .reduce(([remaining, extracted], className) => {
    if(/.*(w-).+/g.test(className)) {
      extracted.push(className);
    } else {
      remaining.push(className);
    }

    return [remaining, extracted] as Tuple<string[]>;
  }, [[], []] as Tuple<string[]>)
.map((part) => part.join(' '))

export default extractWidths;
