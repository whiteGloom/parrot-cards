import { type PropsWithChildren } from 'react';
import clsx from 'clsx';
import { CircleCheck, XCircle } from 'lucide-react';
import { useUnsavedChangesStore } from '../../stores/unsaved-changes.tsx';

export function PageContentWrapper(props: PropsWithChildren<{ contentWrapperClassName?: string }>) {
  const unsavedChangesStoreState = useUnsavedChangesStore();
  return (
    <div className="min-h-full p-3 bg-gradient-to-tr from-purple-300 to-blue-300 overflow-auto">
      <div
        className="grid min-h-full md:place-content-center content-center"
      >
        <div
          className={clsx([
            'flex flex-col gap-2 md:min-w-3xl',
            props.contentWrapperClassName,
          ])}
        >
          <p title="Some changes are unsaved" className="self-end">
            {unsavedChangesStoreState.hasUnsavedChanges
              ? <XCircle className=" text-red-600 fill-white" />
              : <CircleCheck className="text-green-600 fill-white" />}
          </p>
          {props.children}
        </div>
      </div>
    </div>
  );
}
