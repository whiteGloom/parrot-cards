import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useGoogleOauthStore } from '../stores/googleOauthStore.ts';
import { Button, ButtonTheme } from '../widgets/button';
import { Repeat, Settings } from 'lucide-react';
import { useContext, useState } from 'react';
import { CardsStoreContext, useCardsStore } from '../stores/cardsStore.ts';
import { useGoogleDriveStore } from '../stores/googleDrive.ts';
import { parseAndImportSavedFile } from '../features/persistence/savedFileImporter.ts';

export const Route = createFileRoute('/')({
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  const oauthStore = useGoogleOauthStore();
  const cardsStore = useCardsStore();
  const googleDriveStore = useGoogleDriveStore();
  const [isLoadingCards, setLoadingCards] = useState<boolean>(false);
  const isClientIdSet = !!(oauthStore.oauthSettings?.clientId);
  const isAutoImportButtonVisible = isClientIdSet && !!googleDriveStore.itemsCount;

  return (
    <div className="flex flex-col min-h-full justify-center items-center bg-gradient-to-tr from-purple-300 to-blue-300">
      <div
        className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
      >
        <h1 className="text-2xl text-purple-800">Welcome to Parrot Cards!</h1>
        <div className="border border-gray-200 bg-white rounded p-3 flex flex-col gap-3">
          <p className="self-center text-gray-800">Import data from</p>
          <div className="flex row gap-2">
            <Button
              theme={ButtonTheme.primary}
              className="grow"
              onClick={async () => {
                setLoadingCards(true);
                try {
                  if (!isClientIdSet) {
                    navigate({ to: '/google-auth-settings' }).catch(null);
                    return;
                  }

                  await oauthStore.authorize();

                  navigate({ to: '/import-from-google-drive' }).catch(null);
                }
                catch (error) {
                  console.error('Error during authorization:', error);
                }
                finally {
                  setLoadingCards(false);
                }
              }}
              isLoading={isLoadingCards}
            >
              Google Drive
            </Button>
            {isAutoImportButtonVisible && <AutoImportButton />}
            <Button
              className="self-start"
              theme={ButtonTheme.secondary}
              hint="Open settings for Google OAuth"
              onClick={() => {
                navigate({ to: '/google-auth-settings' }).catch(null);
              }}
            >
              <Settings />
            </Button>
          </div>
          <Button
            theme={ButtonTheme.secondary}
          >
            Local File
          </Button>
        </div>
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
            navigate({ to: '/home' }).catch(null);
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function AutoImportButton() {
  const cardsStore = useContext(CardsStoreContext);
  const googleDriveStore = useGoogleDriveStore();
  const oauthStore = useGoogleOauthStore();

  const [isImported, setIsImported] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  async function callback() {
    if (isImporting || isImported) return;

    setIsImporting(true);
    setImportError(null);

    let response;
    try {
      await oauthStore.authorize();

      for (const fileId in googleDriveStore.fileToLoadRecords) {
        const file = googleDriveStore.fileToLoadRecords[fileId];

        response = await gapi.client.drive.files.get({
          fileId: file.fileId,
          alt: 'media',
        });

        if (response.status !== 200) {
          setImportError(`Error fetching file, status: ${response.status}`);
          setIsImporting(false);
          return;
        }

        await parseAndImportSavedFile(cardsStore!, response.body);
      }

      setIsImported(true);
    }
    catch (err) {
      setIsImporting(false);
      setImportError(`Error fetching file ${err}`);
      return;
    }

    setIsImporting(false);
  }

  return (
    <Button
      className="self-start"
      theme={importError ? ButtonTheme.warning : ButtonTheme.primary}
      hint={importError || `One-click import (${googleDriveStore.itemsCount} files)`}
      isLoading={isImporting}
      disabled={isImported}
      onClick={callback}
    >
      <Repeat />
    </Button>
  );
}
