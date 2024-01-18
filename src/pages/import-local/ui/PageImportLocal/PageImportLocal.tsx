import React, {FC} from 'react';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {LinkButton} from '../../../../shared/ui/links/button/LinkButton';
import {ArrowLeft} from 'lucide-react';
import {Field, Form, Formik} from 'formik';
import {ButtonDefault, ButtonDefaultTypes} from '../../../../shared/ui/buttons/default/ButtonDefault';
import {InputDefault} from '../../../../shared/ui/inputs/InputDefault/InputDefault';
import {LabelAbove} from '../../../../shared/ui/inputs/LabelAbove/LabelAbove';
import {MainLayout} from '../../../../shared/ui/layouts/main/MainLayout';
import {loadFileFromFileSystem} from '../../model/actions/loadFileFromFileSystem';
import {loadState, StateObjectType} from '../../model/actions/loadState';

export const PageImportLocal: FC = () => {
  const dispatch = useAppDispatch();
  const [fileToImport, setFileToImport] = React.useState<File>();
  const [isImporting, setIsImporting] = React.useState(false);

  return (
    <MainLayout>
      <header className={'flex gap-3 p-3 bg-gray-50 rounded border items-center'}>
        {isImporting
          ? <ButtonDefault disabled={isImporting}><ArrowLeft/></ButtonDefault>
          :<LinkButton to={'/import'}><ArrowLeft/></LinkButton>}

        <h1 className={'text-3xl font-bold'}>Import from local file</h1>
      </header>

      <section className={'flex flex-col p-3 gap-7 border rounded bg-gray-50'}>
        <form
          className={'flex flex-col gap-3'}
          onSubmit={(event) => {
            event.preventDefault();

            if (!fileToImport) {
              return;
            }

            setIsImporting(true);

            loadFileFromFileSystem(fileToImport)
              .then((fileDataRaw) => dispatch(loadState(JSON.parse(fileDataRaw) as StateObjectType)))
              .finally(() => {
                setIsImporting(false);
              });
          }}
        >
          <LabelAbove>
            Select file to import:
            <input
              className={'p-3 rounded border bg-white'}
              type={'file'}
              onChange={(event) => {
                setFileToImport(event.target.files?.[0]);
              }}
            />
          </LabelAbove>

          <ButtonDefault disabled={!fileToImport || isImporting} theme={ButtonDefaultTypes.Accent}>Import</ButtonDefault>
        </form>
      </section>
    </MainLayout>
  );
};
