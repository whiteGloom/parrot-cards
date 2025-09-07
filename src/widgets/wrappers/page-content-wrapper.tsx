import { type PropsWithChildren } from 'react';
import clsx from 'clsx';

export function PageContentWrapper(props: PropsWithChildren<{ contentWrapperClassName?: string }>) {
  return (
    <div className="min-h-full p-3 bg-gradient-to-tr from-purple-300 to-blue-300 overflow-auto">
      <div
        className="grid min-h-full md:place-content-center content-center"
      >
        <div
          className={clsx([
            'flex flex-col gap-4 md:min-w-3xl',
            props.contentWrapperClassName,
          ])}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
