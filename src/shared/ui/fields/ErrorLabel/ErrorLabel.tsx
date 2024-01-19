import React, {FC} from 'react';
import {ErrorMessage, ErrorMessageProps} from 'formik';
import clsx from 'clsx';

export type ErrorLabelPropsType = ErrorMessageProps;

export const ErrorLabel: FC<ErrorLabelPropsType> = (props) => {
  const {className, ...otherProps} = props;

  return (
  <ErrorMessage {...otherProps}>
      {(error) => (
        <p className={clsx('text-red-500', className)}>{error}</p>
      )}
    </ErrorMessage>
  );
};
