import React, {FC} from 'react';
import {Field, FieldConfig, GenericFieldHTMLAttributes} from 'formik';
import clsx from 'clsx';

export type InputDefaultPropsType = {
    className?: string;
    name: string;
    innerRef?: React.RefObject<HTMLInputElement>;
    errorString?: string;
} & GenericFieldHTMLAttributes & Omit<FieldConfig, 'innerRef'>;

export const InputDefault: FC<InputDefaultPropsType> = (props) => {
  const {className, errorString, ...otherProps} = props;

  return (
    <Field
      className={clsx([
        'border bg-white rounded p-2 shadow',
        'invalid:border-red-500',
        errorString && 'border-red-500',
        className,
      ])}
      {...otherProps}
    />
  );
};
