import React, {FC, PropsWithChildren} from 'react';

export const MainLayout: FC<PropsWithChildren> = (props) => {
  return (
    <div className={'flex w-full h-full overflow-auto'}>
      <div className={'container mx-auto flex flex-col gap-5 p-5 lg:max-w-screen-lg'}>
        {props.children}
      </div>
    </div>
  );
};