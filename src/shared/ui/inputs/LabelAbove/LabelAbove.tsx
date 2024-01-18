import React, {FC, HTMLProps} from 'react';

export type LabelPropsType = HTMLProps<HTMLLabelElement & {
  name?: string;
}>

export const LabelAbove: FC<LabelPropsType> = (props) => {
  const {className, ...otherProps} = props;

  return (
    <label className={'flex flex-col gap-1'} {...otherProps}>
      {props.children}
    </label>
  );
};
