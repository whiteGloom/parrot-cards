import React, {FC} from 'react';
import {ErrorMessage, ErrorMessageProps} from 'formik';

export type ErrorLabelProps = ErrorMessageProps;

export const ErrorLabel: FC<ErrorLabelProps> = (props) => {
  return (
    <ErrorMessage name={props.name}>
      {(error) => (
        <p className={'text-red-500'}>{error}</p>
      )}
    </ErrorMessage>
  );
};
