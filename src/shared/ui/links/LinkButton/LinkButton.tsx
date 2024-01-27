import React, {FC} from 'react';
import clsx from 'clsx';
import {Link, LinkProps} from 'react-router-dom';

export enum LinkButtonDefaultTypes {
  Normal = 1,
  Accent ,
  Warning
}

export type LinkButtonPropsType = LinkProps & React.RefAttributes<HTMLAnchorElement> & {
  theme?: LinkButtonDefaultTypes,
};

export const LinkButton: FC<LinkButtonPropsType> = (props) => {
  const {
    theme = LinkButtonDefaultTypes.Normal,
    className,
    children,
    ...otherProps} = props;

  return (
    <Link
      className={clsx([
        'flex justify-center items-center gap-0.5 font-semibold shadow rounded px-2 py-1',
        theme === LinkButtonDefaultTypes.Normal && 'border text-[#2b2b2b] bg-white border-gray-200 hover:bg-[#f2f2f2] active:bg-[#E7E7E7]',
        theme === LinkButtonDefaultTypes.Accent && 'text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
        theme === LinkButtonDefaultTypes.Warning && 'text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800',
        className,
      ])}
      {...otherProps}
    >
      {children}
    </Link>
  );
};
