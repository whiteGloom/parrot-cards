import React, {FC, HTMLProps} from 'react';
import clsx from 'clsx';

export type LabelPropsType = HTMLProps<HTMLLabelElement & {
  name?: string;
}>

export const LabelAbove: FC<LabelPropsType> = (props) => {
  const {className, ...otherProps} = props;

  return (
    <label className={clsx('flex flex-col gap-1', className)} {...otherProps}>
      {props.children}
    </label>
  );
};
