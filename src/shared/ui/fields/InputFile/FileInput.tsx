import React, {FC, DetailedHTMLProps, InputHTMLAttributes} from 'react';
import clsx from 'clsx';

export type FileInputPropsType = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const FileInput: FC<FileInputPropsType> = (props) => {
  const {className} = props;

  return (
    <input
      {...props}
      type={'file'}
      className={clsx([
        'p-3 rounded border bg-white',
        'file:border file:shadow file:bg-white file:px-2 file:py-1 file:rounded file:border-solid file:border-gray-200',
        'file:hover:bg-[#f2f2f2] file:active:bg-[#E7E7E7] file:disabled:text-gray-500 file:disabled:bg-gray-200',
        className,
      ])}
    />
  );
};
