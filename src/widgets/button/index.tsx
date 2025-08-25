import * as React from 'react';
import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

export const ButtonTheme = {
  primary: 'primary',
  secondary: 'secondary',
  warning: 'warning',
};

export type ButtonThemeType = typeof ButtonTheme[keyof typeof ButtonTheme];

export interface ContentBuilderParms {
  isHovered: boolean
  isPressed: boolean
  isFocused: boolean
  textColor: string
}

export interface ButtonProps extends PropsWithChildren {
  theme?: ButtonThemeType
  label?: string
  disabled?: boolean
  isLoading?: boolean
  className?: string
  hint?: string
  type?: 'button' | 'submit' | 'reset'
  contentBuilder?: (params: ContentBuilderParms) => React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export function Button(props: ButtonProps) {
  const { theme = ButtonTheme.primary } = props;
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const onPressStart = () => {
    setIsPressed(true);
  };

  const onPressEnd = () => {
    setIsPressed(false);
  };

  return (
    <button
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onTouchStart={onPressStart}
      onTouchEnd={onPressEnd}
      type={props.type || 'button'}
      disabled={props.disabled || props.isLoading}
      onClick={props.onClick}
      title={props.hint}
      className={clsx([
        'rounded cursor-pointer disabled:cursor-not-allowed p-2 shadow',
        props.isLoading && 'cursor-wait disabled:cursor-wait',
        theme === ButtonTheme.primary && 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300',
        theme === ButtonTheme.secondary && 'bg-white border border-gray-200 text-gray-800 hover:bg-blue-100 active:bg-blue-200 disable',
        theme === ButtonTheme.warning && 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-300',
        props.className,
      ])}
    >
      {props.label || props.children || props.contentBuilder?.({
        isHovered,
        isPressed,
        isFocused,
        textColor: getComputedStyle(document.documentElement).getPropertyValue('--text-gray-800'),
      }) || 'Button'}
    </button>
  );
}
