import React, {FC} from 'react';
import {LayoutMain} from '../../../shared/ui/layouts/LayoutMain/LayoutMain';
import {LinkButton} from '../../../shared/ui/links/LinkButton/LinkButton';
import {ArrowLeft} from 'lucide-react';
import {ButtonDefault} from '../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {usePageTitle} from '../../../shared/lib/usePageTitle';
import {createImportLocalPagePath} from '../../../shared/routes/importLocal';
import {createHomePagePath} from '../../../shared/routes/home';

export const ImportPage: FC = () => {
  usePageTitle('Import methods');

  return (
    <LayoutMain>
      <header className={'flex gap-3 p-3 bg-gray-50 rounded border'}>
        <LinkButton to={createHomePagePath()}><ArrowLeft/></LinkButton>
        <h1 className={'text-3xl font-bold'}>Import methods</h1>
      </header>

      <section className={'flex flex-col p-3 gap-3 border rounded bg-gray-50 items-start'}>
        <LinkButton to={createImportLocalPagePath()}>Import from JSON file</LinkButton>
        <ButtonDefault disabled>Import from Google Drive</ButtonDefault>
      </section>
    </LayoutMain>
  );
};
