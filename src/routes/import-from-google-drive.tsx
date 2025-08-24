import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { Button, ButtonTheme } from '../widgets/button';
import { useEffect, useRef, useState } from 'react';
import { useCardsStore } from '../stores/cardsStore.ts';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { googleOauthStore } from '../stores/googleOauthStore.ts';

export const Route = createFileRoute('/import-from-google-drive')({
  component: ImportFromGoogleDrive,
  beforeLoad: async () => {
    if (googleOauthStore.getState().authorizationData.state !== 'authorized') {
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
  const [isLoadingFiles, setLoadingFiles] = useState<boolean>(true);
  const [files, setFiles] = useState<File[]>([]);

  const startLoadingFunc = useRef(async () => {
    setLoadingFiles(true);

    let parentFolderId: string | undefined;
    const existingParentFolder = await gapi.client.drive.files.list({
      q: 'mimeType = \'application/vnd.google-apps.folder\' and trashed = false and \'root\' in parents and name = \'Parrot Cards\'',
      fields: 'files(id, name, mimeType, parents)',
      pageSize: 1,
    });

    if (!existingParentFolder.result.files?.length) {
      const newFolder = await gapi.client.drive.files.create({
        resource: {
          name: 'Parrot Cards',
          mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id, name, mimeType, parents',
      });
      parentFolderId = newFolder.result.id;
    }
    else {
      parentFolderId = existingParentFolder.result.files[0].id;
    }

    const response = await gapi.client.drive.files.list({
      q: `trashed = false and '${parentFolderId}' in parents`,
      pageSize: 50,
    });

    setFiles((response.result.files || []).map((file): File => {
      return {
        name: file.name!,
        id: file.id!,
        mimeType: file.mimeType!,
        parents: file.parents,
      };
    }));

    setLoadingFiles(false);
  }).current;

  useEffect(() => {
    startLoadingFunc().catch(null);
  }, [startLoadingFunc]);

  return (
    <div
      className="flex flex-col min-h-full justify-center items-center bg-gradient-to-tr from-purple-300 to-blue-300"
    >
      <div
        className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
      >
        <div className="flex gap-4 items-center">
          <Button
            className="self-start"
            theme={ButtonTheme.secondary}
            onClick={() => {
              navigate({
                to: '..',
              }).catch(null);
            }}
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl text-purple-800">Google OAuth Settings</h1>
        </div>
        <div className="flex row gap-2">
          <Button isLoading={isLoadingFiles} onClick={startLoadingFunc}>
            <RotateCw size={16} />
          </Button>
          <p className="self-center text-gray-800">Existing files with data:</p>
        </div>
        {isLoadingFiles
          && <div className="border border-gray-200 bg-white rounded p-3 flex flex-col gap-3"><p>Loading files...</p></div>}
        {!isLoadingFiles && files.length === 0
          && <div className="border border-gray-200 bg-white rounded p-3 flex flex-col gap-3"><p className="text-gray-600">No files found in &quot;Parrot Cards&quot; folder</p></div>}
        {!isLoadingFiles && files.length > 0 && (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {files.map(file => (
              <div
                key={file.id}
                className="flex flex-col border border-gray-200 rounded p-3 bg-white hover:bg-blue-50 cursor-pointer"
                onClick={async () => {
                  let response;
                  try {
                    response = await gapi.client.drive.files.get({
                      fileId: file.id,
                      alt: 'media',
                    });
                  }
                  catch (err) {
                    console.error('Error fetching file:', err);
                    return;
                  }
                  if (response.status !== 200) {
                    console.error('Error fetching file, status:', response.status);
                    return;
                  }

                  console.log('Loaded files:', response);
                }}
              >
                <p className="font-medium text-gray-800">{file.name}</p>
              </div>
            ))}
          </div>
        )}
        <hr className="border-gray-200" />
        <p className="text-gray-800">
          Loaded:
          {' '}
          {cardsStore.ids.length}
          {' '}
          cards
        </p>
      </div>
    </div>
  );
}
