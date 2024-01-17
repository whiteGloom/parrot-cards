import React, {FC, ButtonHTMLAttributes, DetailedHTMLProps} from 'react';
import clsx from 'clsx';

export enum ButtonDefaultTypes {
  Normal = 1,
  Warning
}

export type ButtonDefaultPropsType = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  theme?: ButtonDefaultTypes,
};

export const ButtonDefault: FC<ButtonDefaultPropsType> = (props) => {
  const {
    theme = ButtonDefaultTypes.Normal,
    className,
    children,
    ...otherProps} = props;

  return (
    <button
      className={clsx([
        'rounded px-2 py-1',
        theme === ButtonDefaultTypes.Normal && 'font-semibold shadow border text-[#2b2b2b] bg-white border-gray-200 hover:bg-[#f2f2f2] active:bg-[#E7E7E7]',
        theme === ButtonDefaultTypes.Warning && 'font-semibold shadow text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800',
        className,
      ])}
      {...otherProps}
    >
      {children}
    </button>
  );
};