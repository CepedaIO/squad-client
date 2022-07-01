import {ButtonHTMLAttributes, DetailedHTMLProps} from "react";
import $c from "classnames";
import omit from "lodash.omit";

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant: 'primary' | 'link' | 'disabled';
  loading?: boolean;
}

const border = 'border-0 py-2 px-5 rounded';
const classesForVariant = new Map([
  ['primary', $c('bg-submit text-white', border)],
  ['link', $c('border-0 underline')],
  ['disabled', $c('bg-disabled text-white', border)]
]);

const Button = (props: ButtonProps) => {
  const { variant, loading, className } = props;
  const buttonProps = omit(props, 'variant', 'loading', 'disabled', 'className');

  let buttonClasses = loading ?
    $c(classesForVariant.get('disabled'), className) :
    $c(classesForVariant.get(variant), className);

  return (
    <button {...buttonProps} className={buttonClasses} disabled={loading} />
  )
}

export default Button;
