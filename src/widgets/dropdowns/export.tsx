import { TagsStoreContext } from '../../stores/tags-store.ts';
import { useContext, useState } from 'react';
import { useGoogleOauthStore } from '../../stores/google-oauth-store.ts';
import { CardsStoreContext } from '../../stores/cards-store.ts';
import { useNavigate } from '@tanstack/react-router';
import { Dropdown } from './index.tsx';
import { InputWrapped } from '../input/input-wrapped.tsx';
import { Button, ButtonTheme } from '../buttons';
import { loadGoogleDriveFolderId } from '../../utils/load-google-drive-folder-id.ts';
import { prepareForExport } from '../../features/persistence/savedFile.ts';
import { Upload } from 'lucide-react';
import { useUnsavedChangesStore } from '../../stores/unsaved-changes.tsx';

export function ExportDropdown() {
  const googleOauthStoreState = useGoogleOauthStore();
  const unsavedChangesStoreState = useUnsavedChangesStore();
  const cardsStore = useContext(CardsStoreContext)!;
  const tagsStore = useContext(TagsStoreContext)!;
  const navigate = useNavigate();

  const [isExportingToGoogle, setIsExportingToGoogle] = useState(false);
  const [exportingToGoogleError, setExportingToGoogleError] = useState<string | null>(null);

  const [fileName, setFileName] = useState('test.json');

  return (
    <Dropdown
      buildContent={() => {
        return (
          <>
            <InputWrapped
              name="export:filename"
              label="File name"
              autofocus={true}
              value={fileName}
              onChange={(event) => {
                setFileName(event.target.value);
              }}
            />
            <Button
              isLoading={isExportingToGoogle}
              hint={exportingToGoogleError || 'Export to Google'}
              theme={exportingToGoogleError ? ButtonTheme.warning : ButtonTheme.primary}
              onClick={async () => {
                setExportingToGoogleError(null);

                if (!googleOauthStoreState.oauthSettings?.clientId) {
                  navigate({ to: '/google-auth-settings' }).catch(null);
                  return;
                }

                setIsExportingToGoogle(true);

                try {
                  if (googleOauthStoreState.authorizationData.state !== 'authorized') {
                    await googleOauthStoreState.authorize();
                  }

                  const parentFolderId = await loadGoogleDriveFolderId();
                  const fileContent = await prepareForExport({
                    cardsStore,
                    tagsStore,
                  });

                  const fileContentBase64 = btoa(fileContent);

                  const contentType = 'application/json';
                  const boundary = '-------314159265358979323846';
                  const delimiter = `\r\n--${boundary}\r\n`;
                  const closeDelim = `\r\n--${boundary}--`;

                  function encode(metadata: { name?: string, mimeType?: string, parents?: string[] }) {
                    return delimiter
                      + 'Content-Type: application/json\r\n\r\n'
                      + JSON.stringify(metadata)
                      + delimiter
                      + 'Content-Type: ' + contentType + '\r\n'
                      + 'Content-Transfer-Encoding: base64\r\n'
                      + '\r\n'
                      + fileContentBase64
                      + closeDelim;
                  }

                  const existingFile = (await gapi.client.drive.files.list({
                    q: `trashed = false and '${parentFolderId}' in parents and name = '${fileName}'`,
                    fields: 'files(id, name, mimeType, parents)',
                    pageSize: 1,
                  })).result.files?.[0];

                  if (existingFile) {
                    await gapi.client.request({
                      path: `/upload/drive/v3/files/${existingFile.id}`,
                      method: 'PATCH',
                      params: { uploadType: 'multipart' },
                      headers: {
                        'Content-Type': 'multipart/related; boundary="' + boundary + '"',
                      },
                      body: encode({

                        name: fileName,
                      }),
                    });
                  }
                  else {
                    await gapi.client.request({
                      path: '/upload/drive/v3/files',
                      method: 'POST',
                      params: { uploadType: 'multipart' },
                      headers: {
                        'Content-Type': 'multipart/related; boundary="' + boundary + '"',
                      },
                      body: encode({
                        name: fileName,
                        mimeType: contentType,
                        parents: [parentFolderId!],
                      }),
                    });
                  }

                  setIsExportingToGoogle(false);
                  unsavedChangesStoreState.markAsSaved();
                }
                catch (err) {
                  setExportingToGoogleError(`${err}`);
                  setIsExportingToGoogle(false);
                }
              }}
            >
              Google Drive
            </Button>
            <Button
              onClick={async () => {
                const file = new Blob([
                  await prepareForExport({
                    cardsStore,
                    tagsStore,
                  }),
                ], { type: 'application/json' });

                const link = document.createElement('A') as HTMLAnchorElement;
                link.href = URL.createObjectURL(file);
                link.download = fileName;
                link.target = '_blank';
                link.click();
                URL.revokeObjectURL(link.download);
                unsavedChangesStoreState.markAsSaved();
              }}
            >
              Local file
            </Button>
          </>
        );
      }}
      buildButton={props => (
        <Button
          onClick={props.toggleOpened}
          hint="Export cards"
          theme={ButtonTheme.primary}
        >
          <>
            <Upload />
            <span className="ml-1 hidden md:flex">Export</span>
          </>
        </Button>
      )}
      contentWrapperClassName="right-0 border bg-white rounded shadow-xl/30 border-gray-200 p-2 gap-2"
    />
  );
}
