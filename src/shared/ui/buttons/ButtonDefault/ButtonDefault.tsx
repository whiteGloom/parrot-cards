import React, {FC, ButtonHTMLAttributes, DetailedHTMLProps} from 'react';
import clsx from 'clsx';

export enum ButtonDefaultTypes {
  Normal = 1,
  Accent,
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
        'font-semibold shadow rounded px-2 py-1',
        theme === ButtonDefaultTypes.Normal && ' border text-[#2b2b2b] bg-white border-gray-200 hover:bg-[#f2f2f2] active:bg-[#E7E7E7] disabled:text-gray-500 disabled:bg-gray-200',
        theme === ButtonDefaultTypes.Accent && 'text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:text-gray-500 disabled:bg-blue-100',
        theme === ButtonDefaultTypes.Warning && 'text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800',
        className,
      ])}
      {...otherProps}
    >
      {children}
    </button>
  );
};