import { InputWrapper } from './intput-wrapper.tsx';
import type { ChangeEvent, RefObject } from 'react';

export function InputWrapped(props: {
  name: string
  label: string
  isRequired?: boolean
  type?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  value: string
  error?: string
  autofocus?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
}) {
  return (
    <InputWrapper
      label={props.label}
      isRequired={props.isRequired}
      id={props.name}
      error={props.error}
    >
      <input
        onChange={(e) => {
          props.onChange(e);
        }}
        ref={props.inputRef}
        autoFocus={props.autofocus || false}
        name={props.name}
        id={props.name}
        value={props.value}
        type={props.type || 'text'}
        className="border p-1 rounded border-gray-400 shadow bg-white"
      />
    </InputWrapper>
  );
}
