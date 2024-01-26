import React, {FC} from 'react';
import {LayoutMain} from '../../../shared/ui/layouts/LayoutMain/LayoutMain';
import {LinkButton} from '../../../shared/ui/links/LinkButton/LinkButton';
import {ButtonDefault} from '../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {ArrowLeft} from 'lucide-react';

export const ExportPage: FC = () => {
  return (
    <LayoutMain>
      <header className={'flex gap-3 p-3 bg-gray-50 rounded border'}>
        <LinkButton to={'/'}><ArrowLeft/></LinkButton>
        <h1 className={'text-3xl font-bold'}>Export methods</h1>
      </header>

      <section className={'flex flex-col p-3 gap-3 border rounded bg-gray-50 items-start'}>
        <LinkButton to={'/export-local'}>Export as local JSON file</LinkButton>

        <ButtonDefault disabled>Export to Google Drive</ButtonDefault>
      </section>
    </LayoutMain>
  );
};
