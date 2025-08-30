import { createRoot } from 'react-dom/client';
import './index.css';
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import {
  createGoogleOauthStore, type GoogleOauthStore,
  GoogleOauthStoreContext,
} from './stores/googleOauthStore.ts';
import { type CardsStore, CardsStoreContext, createCardsStore } from './stores/cardsStore.ts';
import { createGoogleDriveStore, GoogleDriveStoreContext } from './stores/googleDrive.ts';
import { createTagsStore, TagsStoreContext } from './stores/tagsStore.ts';

export type RouterContext = { googleOauthStore: GoogleOauthStore, cardsStore: CardsStore };

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { googleOauthStore: undefined!, cardsStore: undefined! },
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
      const tagsStore = createTagsStore();
      const cardsStore = createCardsStore();

      createRoot(document.getElementById('root')!).render(
        <GoogleOauthStoreContext value={googleOauthStore}>
          <GoogleDriveStoreContext value={googleDriveStore}>
            <CardsStoreContext value={cardsStore}>
              <TagsStoreContext value={tagsStore}>
                <RouterProvider router={router} context={{ googleOauthStore, cardsStore }} />
              </TagsStoreContext>
            </CardsStoreContext>
          </GoogleDriveStoreContext>
        </GoogleOauthStoreContext>,
      );
    });
  });
})();
