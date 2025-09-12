import { useContext, useState } from 'react';
import { CardsStoreContext } from '../../stores/cards-store.ts';
import { useGoogleDriveStore } from '../../stores/google-drive.ts';
import { useGoogleOauthStore } from '../../stores/google-oauth-store.ts';
import { TagsStoreContext } from '../../stores/tags-store.ts';
import { parseAndImportSavedFile } from '../../features/persistence/savedFile.ts';
import { Button, ButtonTheme } from './index.tsx';
import { Repeat } from 'lucide-react';

export function OneClickImportButton(props: { iconSize?: number, onClick?: () => void }) {
  const cardsStore = useContext(CardsStoreContext)!;
  const tagsStore = useContext(TagsStoreContext)!;
  const googleDriveStore = useGoogleDriveStore();
  const oauthStore = useGoogleOauthStore();
  const googleOauthStore = useGoogleOauthStore();

  const [isImported, setIsImported] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  async function callback() {
    if (isImporting || isImported) return;

    props.onClick?.();

    setIsImporting(true);
    setImportError(null);

    try {
      await oauthStore.authorize();

      for (const fileId in googleDriveStore.fileToLoadRecords) {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
          { headers: { Authorization: `Bearer ${googleOauthStore.authorizationData.state === 'authorized' && googleOauthStore.authorizationData.tokenInfo.accessToken}` } },
        );

        if (response.status !== 200) {
          setImportError(`Error fetching file, status: ${response.status}`);
          setIsImporting(false);
          return;
        }

        await parseAndImportSavedFile({
          cardsStore: cardsStore,
          tagsStore: tagsStore,
          fileContent: await response.text(),
        });
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
      disabled={isImported || !googleDriveStore.itemsCount}
      onClick={callback}
    >
      <Repeat size={props.iconSize || 24} />
    </Button>
  );
}
