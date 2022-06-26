import {ButtonHTMLAttributes, DetailedHTMLProps} from "react";
import $c from "classnames";

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant: 'primary';
}

const Button = (props: ButtonProps) => {
  const { variant } = props;

  if(props.disabled) {
    return (
      <button {...props} className={$c(props.className, 'bg-disabled', 'text-white')} />
    )
  }

  return (
    <button {...props} className={$c(props.className, {
      'bg-submit text-white': variant === 'primary'
    })} />
  )
}

export default Button;
