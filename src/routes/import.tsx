import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useGoogleOauthStore } from '../stores/googleOauthStore.ts';
import { Button, ButtonTheme } from '../widgets/buttons';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useCardsStore } from '../stores/cardsStore.ts';
import { useGoogleDriveStore } from '../stores/googleDrive.ts';
import { OneClickImportButton } from '../widgets/buttons/one-click-import.tsx';
import { PageContentWrapper } from '../widgets/wrappers/page-content-wrapper.tsx';

export const Route = createFileRoute('/import')({
  component: Import,
});

function Import() {
  const navigate = useNavigate();
  const oauthStore = useGoogleOauthStore();
  const cardsStore = useCardsStore();
  const googleDriveStore = useGoogleDriveStore();
  const [isLoadingCards, setLoadingCards] = useState<boolean>(false);
  const isClientIdSet = !!(oauthStore.oauthSettings?.clientId);
  const isAutoImportButtonVisible = isClientIdSet && !!googleDriveStore.itemsCount;

  return (
    <PageContentWrapper contentWrapperClassName="bg-gray-50 p-4 rounded">
      <h1 className="text-2xl text-purple-800">Import cards</h1>
      <div className="border border-gray-200 bg-white rounded p-3 flex flex-col gap-3">
        <p className="self-start text-gray-800">Import data from</p>
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
          navigate({ to: '/' }).catch(null);
        }}
      >
        Continue
      </Button>
    </PageContentWrapper>
  );
}
