import React from 'react';
import './App.scss';

const GOOGLE_OAUTH_KEY = process.env.REACT_APP_GOOGLE_OAUTH_KEY as string;
const GOOGLE_DRIVE_API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY as string;

if (!GOOGLE_DRIVE_API_KEY) {
  throw new Error('REACT_APP_GOOGLE_DRIVE_API_KEY env parameter is required');
}

if (!GOOGLE_OAUTH_KEY) {
  throw new Error('REACT_APP_GOOGLE_OAUTH_KEY env parameter is required');
}

function App() {
  const [isClientInited, setClientInited] = React.useState(false);
  const [tokenClient, setTokenClient] = React.useState<ReturnType<typeof google.accounts.oauth2.initTokenClient>>();

  React.useEffect(() => {
    window.onload = () => {
      gapi.load('client', () => {
        gapi.client
          .init({
            apiKey: GOOGLE_DRIVE_API_KEY,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          })
          .then(
            () => {
              setClientInited(true);
              console.log('wgl inited');
            },
            (error) => {
              console.log('Initialization of clint of Google API failed:', error);
            }
          );
      });

      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_OAUTH_KEY,
        scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
        callback: (res) => {
          gapi.client.drive.files.list({
            // @ts-expect-error test
            'pageSize': 10,
            'fields': 'files(id, name)',
          }).then(
            (res) => {
              console.log('List files response', res);
            },
            (error) => {
              console.log('Files list request failed:', error);
            }
          );
        },
      });

      setTokenClient(tokenClient);
    };
  }, []);

  return (
    <div className="App">
      {tokenClient && isClientInited ? (
        <button
          onClick={() => {
            console.log('wgl App.onClick login', gapi.client.getToken());
            if (gapi.client.getToken() === null) {
              // Prompt the user to select a Google Account and ask for consent to share their data
              // when establishing a new session.
              tokenClient.requestAccessToken({prompt: 'consent'});
            } else {
              // Skip display of account chooser and consent dialog for an existing session.
              tokenClient.requestAccessToken({prompt: ''});
            }
          }}>Login</button>
      ) : 'Loading...'}
    </div>
  );
}

export default App;
