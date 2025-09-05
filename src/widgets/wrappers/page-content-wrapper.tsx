import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function PageContentWrapper(props: PropsWithChildren<{ contentWrapperClassName?: string }>) {
  return (
    <div
      className="flex flex-col min-h-full min-w-3xl justify-center items-center bg-gradient-to-tr from-purple-300 to-blue-300 p-3"
    >
      <div
        className={clsx([
          'flex flex-col gap-4 md:min-w-3xl min-w-full',
          props.contentWrapperClassName,
        ])}
      >
        {props.children}
      </div>
    </div>
  );
}
