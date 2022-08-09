import $c from "classnames";

interface SplitProps {
  nowrap?: boolean;
  className?: string;
  left: JSX.Element | JSX.Element[];
  right: JSX.Element | JSX.Element[];
}

const Split = ({
  nowrap, left, right, className
}: SplitProps) => {

  return (
    <section className={$c({
      'col-to-row grow-children': nowrap,
      'flex flex-col': !nowrap
    }, className)}>
      <div className={$c({
        'md:w-1/3': nowrap
      })}>
        { left }
      </div>

      <div className={$c('inline-block', {
        'md:w-2/3': nowrap
      })}>
        { right }
      </div>
    </section>
  )
}

export default Split;
