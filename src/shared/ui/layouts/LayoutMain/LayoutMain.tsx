import React, {FC, PropsWithChildren} from 'react';

export const LayoutMain: FC<PropsWithChildren> = (props) => {
  return (
    <div className={'flex w-full h-full overflow-auto'}>
      <main className={'w-full md:container mx-auto flex flex-col gap-5 p-5 lg:max-w-screen-lg'}>
        {props.children}
      </main>
    </div>
  );
};