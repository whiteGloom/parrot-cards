import React, {FC} from 'react';
import {MainLayout} from '../../../../shared/ui/layouts/main/MainLayout';
import {LinkButton} from '../../../../shared/ui/links/button/LinkButton';
import {ArrowLeft} from 'lucide-react';
import {ButtonDefault} from '../../../../shared/ui/buttons/default/ButtonDefault';

export const PageImport: FC = () => {
  return (
    <MainLayout>
      <header className={'flex gap-3 p-3 bg-gray-50 rounded border'}>
        <LinkButton to={'/'}><ArrowLeft/></LinkButton>
        <h1 className={'text-3xl font-bold'}>Import methods</h1>
      </header>

      <section className={'flex flex-col p-3 gap-3 border rounded bg-gray-50 items-start'}>
        <ButtonDefault disabled>Import from JSON file</ButtonDefault>
        <ButtonDefault disabled>Import from Google Drive</ButtonDefault>
      </section>
    </MainLayout>
  );
};
