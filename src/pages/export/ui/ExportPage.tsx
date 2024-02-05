import React, {FC} from 'react';
import {LayoutMain} from '../../../shared/ui/layouts/LayoutMain/LayoutMain';
import {LinkButton} from '../../../shared/ui/links/LinkButton/LinkButton';
import {ButtonDefault} from '../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {ArrowLeft} from 'lucide-react';
import {usePageTitle} from '../../../shared/lib/usePageTitle';
import {createHomePagePath} from '../../../shared/routes/home';
import {createExportLocalPagePath} from '../../../shared/routes/exportLocal';

export const ExportPage: FC = () => {
  usePageTitle('Export methods');

  return (
    <LayoutMain>
      <header className={'flex gap-3 p-3 bg-gray-50 rounded border'}>
        <LinkButton to={createHomePagePath()}><ArrowLeft/></LinkButton>
        <h1 className={'text-3xl font-bold'}>Export methods</h1>
      </header>

      <section className={'flex flex-col p-3 gap-3 border rounded bg-gray-50 items-start'}>
        <LinkButton to={createExportLocalPagePath()}>Export as local JSON file</LinkButton>

        <ButtonDefault disabled>Export to Google Drive</ButtonDefault>
      </section>
    </LayoutMain>
  );
};
