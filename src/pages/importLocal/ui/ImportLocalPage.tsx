import React, {FC} from 'react';
import {LinkButton} from '../../../shared/ui/links/LinkButton/LinkButton';
import {ArrowLeft} from 'lucide-react';
import {ButtonDefault, ButtonDefaultTypes} from '../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {LabelAbove} from '../../../shared/ui/fields/LabelAbove/LabelAbove';
import {LayoutMain} from '../../../shared/ui/layouts/LayoutMain/LayoutMain';
import {loadFileFromFileSystem} from '../../../shared/lib/loadFileFromFileSystem';
import {FileInput} from '../../../shared/ui/fields/InputFile/FileInput';
import {useLoadDataDumpThunk} from '../../../features/importData/model/actions/loadDataDump';
import {IDumpUnknown} from '../../../entity/dump/types/dump';
import {useAddNotificationThunk} from '../../../features/notifications/addNotification';
import {NotificationType} from '../../../entity/notification';

export const ImportLocalPage: FC = () => {
  const dispatchLoadDataDump = useLoadDataDumpThunk();
  const addNotification = useAddNotificationThunk();

  const [fileToImport, setFileToImport] = React.useState<File>();
  const [isImporting, setIsImporting] = React.useState(false);

  return (
    <LayoutMain>
      <header className={'flex gap-3 p-3 bg-gray-50 rounded border items-center'}>
        {isImporting
          ? <ButtonDefault disabled={isImporting}><ArrowLeft/></ButtonDefault>
          : <LinkButton to={'/import'}><ArrowLeft/></LinkButton>
        }

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
              .then((fileDataRaw) => dispatchLoadDataDump({dump: JSON.parse(fileDataRaw) as IDumpUnknown}))
              .then(
                () => addNotification({
                  type: NotificationType.Success,
                  title: 'Imported successfully',
                }),
                (err: unknown) => addNotification({
                  type: NotificationType.Error,
                  title: `Import error: ${err as string}`,
                })
              )
              .finally(() => {
                (event.target as HTMLFormElement).reset();
                setIsImporting(false);
                setFileToImport(undefined);
              });
          }}
        >
          <LabelAbove label={'Select file to import'}>
            <FileInput
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
