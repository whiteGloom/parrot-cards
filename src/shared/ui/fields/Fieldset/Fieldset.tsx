import React, {FC, HTMLProps} from 'react';
import clsx from 'clsx';

export type FieldsetPropsType = HTMLProps<HTMLFieldSetElement> & {
  legend?: string;
};

export const Fieldset: FC<FieldsetPropsType> = (props) => {
  const {legend, className, ...otherProps} = props;

  return (
    <fieldset className={clsx('flex flex-col border rounded flex-1 p-3 bg-white gap-3 shadow-inner', className)} {...otherProps}>
      {legend ? (<legend className={'font-semibold'}>{legend}</legend>) : undefined}

      {props.children}
    </fieldset>
  );
};
