import { createRoot } from 'react-dom/client';
import './index.css';
import { routeTree } from './routeTree.gen';
import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import {
  createGoogleOauthStore, type GoogleOauthStore,
  GoogleOauthStoreContext,
} from './stores/google-oauth-store.ts';
import { type CardsStore, CardsStoreContext, createCardsStore } from './stores/cards-store.ts';
import { createGoogleDriveStore, GoogleDriveStoreContext } from './stores/google-drive.ts';
import { createTagsStore, TagsStoreContext } from './stores/tags-store.ts';
import {
  createExplicitRevisesStore,
  type ExplicitRevisesStore,
  ExplicitRevisesStoreContext,
} from './stores/explicit-revises.ts';
import { createUnsavedChangesStore, UnsavedChangesStoreContext } from './stores/unsaved-changes.tsx';
import { createExportSettingsStore, ExportSettingsStoreContext } from './stores/export-settings.tsx';

export type RouterContext = {
  googleOauthStore: GoogleOauthStore
  cardsStore: CardsStore
  explicitRevisesStore: ExplicitRevisesStore
};

// Create a new router instance
const router = createRouter({
  routeTree,
  history: createHashHistory(),
  context: {
    googleOauthStore: undefined!,
    cardsStore: undefined!,
    explicitRevisesStore: undefined!,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

(() => {
  gapi.load('client', () => {
    gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest').then(() => {
      const googleOauthStore = createGoogleOauthStore();
      const googleDriveStore = createGoogleDriveStore();
      const unsavedChangesStore = createUnsavedChangesStore();
      const tagsStore = createTagsStore({ unsavedChangesStore });
      const cardsStore = createCardsStore({ unsavedChangesStore });
      const explicitRevisesStore = createExplicitRevisesStore();
      const exportSettingsStore = createExportSettingsStore();

      window.addEventListener('beforeunload', function (event) {
        if (unsavedChangesStore.getState().hasUnsavedChanges) {
          event.preventDefault();
        }
      });

      createRoot(document.getElementById('root')!).render(
        <ExportSettingsStoreContext value={exportSettingsStore}>
          <GoogleOauthStoreContext value={googleOauthStore}>
            <GoogleDriveStoreContext value={googleDriveStore}>
              <UnsavedChangesStoreContext value={unsavedChangesStore}>
                <CardsStoreContext value={cardsStore}>
                  <TagsStoreContext value={tagsStore}>
                    <ExplicitRevisesStoreContext value={explicitRevisesStore}>
                      <RouterProvider
                        router={router}
                        context={{ googleOauthStore, cardsStore, explicitRevisesStore }}
                      />
                    </ExplicitRevisesStoreContext>
                  </TagsStoreContext>
                </CardsStoreContext>
              </UnsavedChangesStoreContext>
            </GoogleDriveStoreContext>
          </GoogleOauthStoreContext>
        </ExportSettingsStoreContext>,
      );
    });
  });
})();
