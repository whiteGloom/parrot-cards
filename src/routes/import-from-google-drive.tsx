import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { Button, ButtonTheme } from '../widgets/buttons';
import { useContext, useEffect, useRef, useState } from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { LoadingIndicator } from '../widgets/loading-indicator';
import { parseAndImportSavedFile } from '../features/persistence/savedFile.ts';
import { type FileToLoadRecords, useGoogleDriveStore } from '../stores/googleDrive.ts';
import { CardsStoreContext, useCardsStore } from '../stores/cardsStore.ts';
import { TagsStoreContext } from '../stores/tagsStore.ts';
import { OneClickImportButton } from '../widgets/buttons/one-click-import.tsx';
import { loadGoogleDriveFolderId } from '../utils/loadGoogleDriveFolderId.ts';
import { PageContentWrapper } from '../widgets/wrappers/page-content-wrapper.tsx';

export const Route = createFileRoute('/import-from-google-drive')({
  component: ImportFromGoogleDrive,
  beforeLoad: async ({ context }) => {
    if (context.googleOauthStore.getState().authorizationData.state !== 'authorized') {
      throw redirect({ to: '/' });
    }
  },
});

type File = {
  id: string
  name: string
  mimeType: string
  parents?: string[]
};

function ImportFromGoogleDrive() {
  const navigate = useNavigate();
  const cardsStore = useCardsStore();
  const googleDriveStore = useGoogleDriveStore();
  const [isLoadingFiles, setLoadingFiles] = useState<boolean>(true);
  const [files, setFiles] = useState<File[]>([]);
  const [missingFiles, setMissingFiles] = useState<FileToLoadRecords[]>([]);

  const startLoadingFunc = async () => {
    setLoadingFiles(true);

    const parentFolderId = await loadGoogleDriveFolderId();

    const response = await gapi.client.drive.files.list({
      q: `trashed = false and '${parentFolderId}' in parents`,
      pageSize: 50,
    });

    const files = (response.result.files || []).map((file): File => {
      return {
        name: file.name!,
        id: file.id!,
        mimeType: file.mimeType!,
        parents: file.parents,
      };
    });

    const filesIds = files.map(file => file.id);

    const missingFiles = [];

    for (const fileId in googleDriveStore.fileToLoadRecords) {
      if (!filesIds.includes(fileId)) {
        missingFiles.push(googleDriveStore.fileToLoadRecords[fileId]);
      }
    }

    setFiles(files);
    setMissingFiles(missingFiles);

    setLoadingFiles(false);
  };

  const startLoadingFuncForMount = useRef(startLoadingFunc).current;

  useEffect(() => {
    startLoadingFuncForMount().catch(null);
  }, [startLoadingFuncForMount]);

  return (
    <PageContentWrapper contentWrapperClassName="bg-gray-50 p-4 rounded">
      <div className="flex gap-4 items-center">
        <Button
          className="self-start"
          theme={ButtonTheme.secondary}
          onClick={() => {
            navigate({
              to: '/import',
            }).catch(null);
          }}
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl text-purple-800">Import from Google Drive</h1>
      </div>
      <div className="flex row gap-2">
        <Button isLoading={isLoadingFiles} onClick={startLoadingFunc}>
          <RotateCw size={16} />
        </Button>
        <p className="grow text-center text-gray-800">Existing files with data:</p>
        <OneClickImportButton iconSize={16} />
      </div>
      {isLoadingFiles
        && <div className="border border-gray-200 bg-white rounded p-2 flex flex-col gap-3"><p>Loading files...</p></div>}
      {!isLoadingFiles && files.length === 0
        && <div className="border border-gray-200 bg-white rounded p-2 flex flex-col gap-3"><p className="text-gray-600">No files found in &quot;Parrot Cards&quot; folder</p></div>}
      {!isLoadingFiles && files.length > 0 && (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {files.map(file => (
            <FileCard file={file} key={file.id} />
          ))}
        </div>
      )}
      {!!missingFiles.length && (
        <>
          <p className="text-red-800">Some of one-click import files are missing!</p>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {missingFiles.map(file => (
              <Button
                key={file.fileId}
                theme={ButtonTheme.warning}
                hint="Remove from one-click import list"
                onClick={() => {
                  setMissingFiles(missingFiles.filter(f => f.fileId !== file.fileId));
                  googleDriveStore.removeFileToLoad(file.fileId);
                }}
              >
                {file.fileName}
                {' '}
                (ID:
                {file.fileId}
                )
              </Button>
            ))}
          </div>
        </>
      )}
      <hr className="border-gray-200" />
      <p className="text-gray-800">
        Loaded:
        {' '}
        {cardsStore.cardsIds.length}
        {' '}
        cards
      </p>
      <Button
        onClick={() => {
          navigate({ to: '/' }).catch(null);
        }}
      >
        Go home
      </Button>
    </PageContentWrapper>
  );
}

function FileCard(props: { file: File }) {
  const [isImported, setIsImported] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const cardsStore = useContext(CardsStoreContext)!;
  const tagsStore = useContext(TagsStoreContext)!;
  const googleDriveStore = useGoogleDriveStore();

  const { file } = props;

  const isChecked = !!googleDriveStore.fileToLoadRecords[file.id];

  return (
    <Button
      key={file.id}
      isLoading={isImporting}
      disabled={isImported}
      theme={ButtonTheme.secondary}
      onClick={async () => {
        if (isImporting || isImported) return;

        setIsImporting(true);
        setImportError(null);

        let response;
        try {
          response = await gapi.client.drive.files.get({
            fileId: file.id,
            alt: 'media',
          });

          if (response.status !== 200) {
            setImportError(`Error fetching file, status: ${response.status}`);
            setIsImporting(false);
            return;
          }

          await parseAndImportSavedFile({
            cardsStore: cardsStore,
            tagsStore: tagsStore,
            fileContent: response.body,
          });
          setIsImported(true);
        }
        catch (err) {
          setIsImporting(false);
          setImportError(`Error fetching file ${err}`);
          return;
        }

        setIsImporting(false);
      }}
      contentBuilder={(params) => {
        return (
          <div className="flex grow flex-col items-start">
            <div className="flex w-full justify-between">
              <p title={file.id} className="font-medium grow text-start" style={{ color: params.textColor }}>{file.name}</p>
              <input
                title="Mark the file to add it to one-click import list"
                type="checkbox"
                checked={isChecked}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onChange={(e) => {
                  e.stopPropagation();

                  if (isChecked) {
                    googleDriveStore.removeFileToLoad(file.id);
                  }
                  else {
                    googleDriveStore.addFileToLoad({
                      fileId: file.id,
                      fileName: file.name,
                    });
                  }
                }}
              />
            </div>
            {importError && <p className="text-red-500">{importError}</p>}
            {isImported && <p className="text-green-500">Imported!</p>}
            {isImporting && <LoadingIndicator />}
          </div>
        );
      }}
    />
  );
}
