import * as React from 'react';
import { type PropsWithChildren, useMemo } from 'react';
import clsx from 'clsx';

export const ButtonTheme = {
  primary: 'primary',
  secondary: 'secondary',
  warning: 'warning',
  transparentWarning: 'transparent-warning',
};

export type ButtonThemeType = typeof ButtonTheme[keyof typeof ButtonTheme];

export const ButtonSize = {
  extraSmall: 'extra-small',
  medium: 'medium',
};

export type ButtonSizeType = typeof ButtonSize[keyof typeof ButtonSize];

export interface ContentBuilderParms {
  isHovered: boolean
  isPressed: boolean
  isFocused: boolean
  textColor: string
}

export interface ButtonProps extends PropsWithChildren {
  theme?: ButtonThemeType
  size?: ButtonSizeType
  label?: string
  disabled?: boolean
  isLoading?: boolean
  className?: string
  contentWrapperClassName?: string
  hint?: string
  type?: 'button' | 'submit' | 'reset'
  contentBuilder?: (params: ContentBuilderParms) => React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export function Button(props: ButtonProps) {
  const size = props.size || ButtonSize.medium;
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

  const textColor: string = useMemo(() => {
    const colorName = theme === ButtonTheme.transparentWarning
      ? 'color-red-500'
      : 'color-gray-800';

    return getComputedStyle(document.documentElement).getPropertyValue('--' + colorName);
  }, [theme]);

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
        'flex relative justify-center rounded cursor-pointer disabled:cursor-not-allowed shadow',
        props.isLoading && 'cursor-wait disabled:cursor-wait',
        size === ButtonSize.extraSmall && 'p-0.5',
        size === ButtonSize.medium && 'p-2',
        theme === ButtonTheme.primary && 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300',
        theme === ButtonTheme.secondary && 'bg-white hover:bg-blue-100 active:bg-blue-200 disable',
        theme === ButtonTheme.warning && 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-300',
        theme === ButtonTheme.transparentWarning && 'text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-300',
        props.className,
      ])}
    >
      <div
        className={clsx([
          'absolute rounded w-full h-full top-0 left-0',
          theme === ButtonTheme.secondary && 'border border-gray-200',
        ])}
      />
      <div
        className={clsx(['relative grow flex items-center justify-center', props.contentWrapperClassName])}
      >
        {props.label || props.children || props.contentBuilder?.({
          isHovered,
          isPressed,
          isFocused,
          textColor,
        }) || 'Button'}
      </div>
    </button>
  );
}
