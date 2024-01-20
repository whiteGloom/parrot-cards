import React, {FC, HTMLProps} from 'react';
import clsx from 'clsx';

export type LabelAbovePropsType = HTMLProps<HTMLLabelElement & {
  label: string;
  name?: string;
  required?: boolean;
}>

export const LabelAbove: FC<LabelAbovePropsType> = (props) => {
  const {className, required, label, ...otherProps} = props;

  return (
    <label className={clsx('flex flex-col gap-1', className)} {...otherProps}>
      <span>{label} {required ? <span className={'text-red-600 font-bold'}>*</span> : undefined}</span>
      {props.children}
    </label>
  );
};
