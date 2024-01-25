import React, {FC} from 'react';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {LinkButton} from '../../../../shared/ui/links/LinkButton/LinkButton';
import {ArrowLeft} from 'lucide-react';
import {ButtonDefault, ButtonDefaultTypes} from '../../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {LabelAbove} from '../../../../shared/ui/fields/LabelAbove/LabelAbove';
import {LayoutMain} from '../../../../shared/ui/layouts/LayoutMain/LayoutMain';
import {loadFileFromFileSystem} from '../../model/actions/loadFileFromFileSystem';
import {loadState, StateObjectType} from '../../model/actions/loadState';

export const PageImportLocal: FC = () => {
  const dispatch = useAppDispatch();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [fileToImport, setFileToImport] = React.useState<File>();
  const [isImporting, setIsImporting] = React.useState(false);

  return (
    <LayoutMain>
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

            const importingPromise = loadFileFromFileSystem(fileToImport)
              .then((fileDataRaw) => dispatch(loadState(JSON.parse(fileDataRaw) as StateObjectType)));

            // Synthetic loading to prevent ui flashes
            // TODO: Remove after implementation of notifications system
            Promise
              .all([
                importingPromise,
                new Promise(resolve => setTimeout(resolve, 750)),
              ])
              .finally(() => {
                (event.target as HTMLFormElement).reset();
                setIsImporting(false);
              });
          }}
        >
          <LabelAbove label={'Select file to import'}>
            <input
              ref={fileInputRef}
              className={'p-3 rounded border bg-white file:border file:shadow file:bg-white file:px-3 file:py-2 file:rounded file:border-solid file:border-gray-200 file:hover:bg-[#f2f2f2] file:active:bg-[#E7E7E7] file:disabled:text-gray-500 file:disabled:bg-gray-200'}
              type={'file'}
              onChange={(event) => {
                setFileToImport(event.target.files?.[0]);
              }}
            />
          </LabelAbove>

          <ButtonDefault disabled={!fileToImport || isImporting} theme={ButtonDefaultTypes.Accent}>{isImporting ? 'Loading...' : 'Import'}</ButtonDefault>
        </form>
      </section>
    </LayoutMain>
  );
};
