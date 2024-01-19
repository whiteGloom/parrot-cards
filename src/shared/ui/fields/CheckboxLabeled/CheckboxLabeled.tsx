import React, {FC, HTMLProps} from 'react';
import {Field} from 'formik';
import clsx from 'clsx';

export type CheckboxLabeledPropsType = HTMLProps<HTMLLabelElement> & {
  name: string;
  value: string | number,
  className?: string;
  disabled?: boolean,
};

export const CheckboxLabeled: FC<CheckboxLabeledPropsType> = (props) => {
  const {
    className,
    title,
    name,
    disabled,
    value,
    ...otherProps
  } = props;

  return (
    <label className={clsx('flex p-2 gap-2 bg-white border shadow rounded items-center', className)} {...otherProps}>
      <Field
        type={'checkbox'}
        name={name}
        disabled={disabled}
        value={value}
      />

      {props.children}
    </label>
  );
};