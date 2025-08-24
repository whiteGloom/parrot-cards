import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useGoogleOauthStore } from '../stores/googleOauthStore.ts';
import { Button, ButtonTheme } from '../widgets/button';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useCardsStore } from '../stores/cardsStore.ts';

export const Route = createFileRoute('/')({
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  const oauthStore = useGoogleOauthStore();
  const cardsStore = useCardsStore();
  const [isLoadingCards, setLoadingCards] = useState<boolean>(false);

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
                  if (!oauthStore.oauthSettings?.clientId) {
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
            <Button
              className="self-start"
              theme={ButtonTheme.secondary}
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
          {cardsStore.ids.length}
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
