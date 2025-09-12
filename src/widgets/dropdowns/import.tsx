import { Button, ButtonTheme } from '../buttons';
import { Download, Settings } from 'lucide-react';
import { OneClickImportButton } from '../buttons/one-click-import.tsx';
import { useNavigate } from '@tanstack/react-router';
import { useGoogleOauthStore } from '../../stores/google-oauth-store.ts';
import { useGoogleDriveStore } from '../../stores/google-drive.ts';
import { useContext, useState } from 'react';
import { Dropdown } from './index.tsx';
import clsx from 'clsx';
import { parseAndImportSavedFile } from '../../features/persistence/savedFile.ts';
import { CardsStoreContext } from '../../stores/cards-store.ts';
import { TagsStoreContext } from '../../stores/tags-store.ts';

export function ImportDataDropdown() {
  const navigate = useNavigate();
  const oauthStore = useGoogleOauthStore();
  const googleDriveStore = useGoogleDriveStore();
  const cardsStore = useContext(CardsStoreContext)!;
  const tagsStore = useContext(TagsStoreContext)!;

  const [isLoadingCards, setLoadingCards] = useState<boolean>(false);
  const isClientIdSet = !!(oauthStore.oauthSettings?.clientId);
  const isAutoImportButtonVisible = isClientIdSet && !!googleDriveStore.itemsCount;
  const [fileToImport, setFileToImport] = useState<File>();

  return (
    <Dropdown
      buildButton={props => (
        <Button
          onClick={props.toggleOpened}
          hint="Import cards"
          theme={ButtonTheme.secondary}
        >
          <>
            <Download />
            <span className="ml-1 hidden md:flex">Import</span>
          </>
        </Button>
      )}
      contentWrapperClassName="right-[-3rem] min-w-xxs"
      buildContent={({ close }) => (
        <div className="flex flex-col gap-2 p-2 shadow-xl/30 bg-white rounded border border-gray-200 max-h-60 overflow-y-auto">
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
            {isAutoImportButtonVisible && <OneClickImportButton />}
            <Button
              className="self-start"
              theme={ButtonTheme.secondary}
              hint="Open settings for Google OAuth"
              onClick={() => {
                navigate({ to: '/google-auth-settings' }).catch(null);
                close();
              }}
            >
              <Settings />
            </Button>
          </div>
          <hr className="border-gray-200 mt-2 mb-2" />
          <input
            type="file"
            className={clsx([
              'p-2 rounded border bg-white border-gray-200',
              'file:border file:shadow file:bg-white file:px-2 file:py-1 file:rounded file:border-solid file:border-gray-200',
              'file:hover:bg-[#f2f2f2] file:active:bg-[#E7E7E7] file:disabled:text-gray-500 file:disabled:bg-gray-200',
            ])}
            onChange={(event) => {
              setFileToImport(event.target.files?.[0]);
            }}
          />
          <Button
            disabled={!fileToImport}
            isLoading={isLoadingCards}
            onClick={async () => {
              setLoadingCards(true);
              try {
                const data: string = await new Promise((resolve, reject) => {
                  const reader = new FileReader();

                  reader.onload = function () {
                    resolve(reader.result as string);
                  };

                  reader.onerror = reject;
                  reader.onabort = reject;

                  reader.readAsText(fileToImport!);
                });

                await parseAndImportSavedFile({
                  cardsStore: cardsStore,
                  tagsStore: tagsStore,
                  fileContent: data,
                });
              }
              catch (err) {
                console.error(err);
              }
              finally {
                setLoadingCards(false);
              }
            }}
          >
            Local File
          </Button>
        </div>
      )}
    />
  );
}
