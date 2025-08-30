import type { ReactNode } from 'react';

export function InputWrapper(props: {
  label: string
  isRequired?: boolean
  children: ReactNode
  id?: string
  error?: string
}) {
  return (
    <label className="flex flex-col gap-1" htmlFor={props.id}>
      <p>
        {props.label + ' '}
        {props.isRequired && <span className="text-red-600">*</span>}
      </p>
      {props.children}
      {!!props.error && (
        <p className="text-red-600">{props.error}</p>
      )}
    </label>
  );
}
