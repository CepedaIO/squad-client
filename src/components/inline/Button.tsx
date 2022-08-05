import React, {ButtonHTMLAttributes, DetailedHTMLProps, useContext, useState, MouseEvent} from "react";
import $c from "classnames";
import {omit} from "lodash";
import FormContext, {IFormContext} from "../../providers/FormContext";
import {ist} from "../../services/utils";

type Variants = 'submit' | 'reject' | 'optional' | 'link' | 'tab' | 'toggle' | 'disabled';

type BaseProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant: Variants;
  active?: boolean;
  loading?: boolean;
}

type ToggleButtonProps = BaseProps & {
  variant: 'toggle';
  initialValue?: boolean;
  field?: string;
  onChange?: (val: boolean) => void;
}

type ButtonProps = BaseProps | ToggleButtonProps;

const border = 'border-0 rounded';
const padding = 'py-2 px-5';

const isToggleButtonProps = ist<ToggleButtonProps>((obj) => obj.variant === 'toggle');

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

const ToggleDecorator = (active: boolean, { variant }: ButtonProps) => {
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

const Button = <Values extends Keyed>(props: ButtonProps) => {
  const [active, setActive] = useState<boolean>(isToggleButtonProps(props) ? !!props.initialValue : false);
  const { loading } = props;
  const buttonProps = omit(props, 'variant', 'loading', 'disabled', 'className', 'active', 'children');
  const { onChange } = useContext<IFormContext<Values>>(FormContext);
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    setActive(!active);

    if(isToggleButtonProps(props)) {
      //@ts-ignore
      if(props.field) onChange(props.field, !active);
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
      disabled={loading}
      onClick={onClick}
    >
      { props.children }
      { ToggleDecorator(active, props) }
    </button>
  )
}

export default Button;
