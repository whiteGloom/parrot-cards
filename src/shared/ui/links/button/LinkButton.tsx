import React, {FC} from 'react';
import clsx from 'clsx';
import {Link, LinkProps} from 'react-router-dom';

export enum LinkButtonDefaultTypes {
  Normal = 1,
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
        'rounded px-2 py-1',
        theme === LinkButtonDefaultTypes.Normal && 'font-semibold shadow border text-[#2b2b2b] bg-white border-gray-200 hover:bg-[#f2f2f2] active:bg-[#E7E7E7]',
        theme === LinkButtonDefaultTypes.Warning && 'font-semibold shadow text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800',
        className,
      ])}
      {...otherProps}
    >
      {children}
    </Link>
  );
};