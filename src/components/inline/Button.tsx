import {ButtonHTMLAttributes, DetailedHTMLProps} from "react";

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const Button = (props: ButtonProps) => {

  return (
  <button {...props} />
  )
}

export default Button;
