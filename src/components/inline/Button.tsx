import React, {ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent} from "react";
import $c from "classnames";
import {omit} from "lodash";
import {ist} from "../../services/utils";

type Variants = 'submit' | 'reject' | 'optional' | 'link' | 'tab' | 'toggle' | 'disabled';

type BaseProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant: Variants;
  active?: boolean;
  loading?: boolean;
}

export type ToggleButtonProps = Omit<BaseProps, 'onChange'> & {
  variant: 'toggle';
  initialValue?: boolean;
  onChange?: (val: boolean) => void;
}

export type ButtonProps = BaseProps | ToggleButtonProps;

const border = 'border-0 rounded';
const padding = 'py-2 px-5';

const isToggleButtonProps = ist<ToggleButtonProps>((obj) => obj.variant === 'toggle');

const classesForVariant = new Map<Variants, string | ((props: ButtonProps) => string)>([
  ['submit', $c('bg-submit text-white', padding, border)],
  ['reject', $c('bg-gray-200', padding)],
  ['optional', $c('bg-violet-100', padding)],
  ['toggle', $c('text-left p-0')],
  ['link', ({active}) => $c('border-0 underline', {
    'bg-red-100': active
  })],
  ['tab', ({active}) => $c('border-2', padding, {
    'text-submit': active
  })],
  ['disabled', $c('bg-disabled text-white', padding, border)]
]);

const getClasses = (props: ButtonProps) => {
  const { variant, loading, disabled, className } = props;
  const buttonClasses = (loading || disabled) ? classesForVariant.get('disabled') : classesForVariant.get(variant);

  if(typeof buttonClasses === 'function') {
    return $c(className, buttonClasses(props));
  }

  return $c(className, buttonClasses);
}

const ToggleDecorator = ({ variant, active }: ButtonProps) => {
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
  const { loading, disabled, active } = props;
  const buttonProps = omit(props, 'variant', 'loading', 'disabled', 'className', 'active', 'children', 'onChange');
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    if(isToggleButtonProps(props)) {
      if(props.onChange) props.onChange(!active);
    }

    if(props.onClick) {
      props.onClick(e)
    }
  };

  return (
    <button
      {...buttonProps}
      className={getClasses(props)}
      disabled={loading || disabled}
      onClick={onClick}
    >
      { props.children }
      { ToggleDecorator(props) }
    </button>
  )
}

export default Button;
