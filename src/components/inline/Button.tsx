import React, {ButtonHTMLAttributes, DetailedHTMLProps} from "react";
import $c from "classnames";
import omit from "lodash.omit";

type Variants = 'submit' | 'reject' | 'optional' | 'link' | 'tab' | 'toggle' | 'disabled';

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant: Variants;
  active?: boolean;
  loading?: boolean;
}

const border = 'border-0 rounded';
const padding = 'py-2 px-5';

const classesForVariant = new Map<Variants, string | ((props: ButtonProps) => string)>([
  ['submit', $c('bg-submit text-white', padding, border)],
  ['reject', $c('bg-gray-200', padding)],
  ['optional', $c('bg-violet-100', padding)],
  ['toggle', $c('text-left p-0')],
  ['link', ({active}) => $c('border-0 underline', padding, {
    'bg-red-100': active
  })],
  ['tab', ({active}) => $c('border-2', padding, {
    'text-submit': active
  })],
  ['disabled', $c('bg-disabled text-white', padding, border)]
]);

const getClasses = (props: ButtonProps) => {
  const { variant, loading, className } = props;
  const buttonClasses = loading ? classesForVariant.get('disabled') : classesForVariant.get(variant);

  if(typeof buttonClasses === 'function') {
    return $c(className, buttonClasses(props));
  }

  return $c(className, buttonClasses);
}

const ToggleDecorator = ({ active, variant }: ButtonProps) => {
  if(variant !== 'toggle') {
    return null;
  }

  if(active) {
    return <i className="fa-solid fa-thumbs-up text-success ml-6"></i>;
  }

  if(!active) {
    return <i className="fa-solid fa-thumbs-down text-reject ml-6"></i>;
  }
}

const Button = (props: ButtonProps) => {
  const { loading } = props;
  const buttonProps = omit(props, 'variant', 'loading', 'disabled', 'className', 'active', 'children');

  return (
    <button
      {...buttonProps}
      className={getClasses(props)}
      disabled={loading}
    >
      { props.children }
      { ToggleDecorator(props) }
    </button>
  )
}

export default Button;
