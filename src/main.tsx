import { createRoot } from 'react-dom/client';
import './index.css';
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import {
  createGoogleOauthStore, type GoogleOauthStore,
  GoogleOauthStoreContext,
} from './stores/googleOauthStore.ts';
import { CardsStoreContext, createCardsStore } from './stores/cardsStore.ts';

export type RouterContext = { googleOauthStore: GoogleOauthStore };

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { googleOauthStore: undefined! },
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
      const cardsStore = createCardsStore();

      createRoot(document.getElementById('root')!).render(
        <GoogleOauthStoreContext value={googleOauthStore}>
          <CardsStoreContext value={cardsStore}>
            <RouterProvider router={router} context={{ googleOauthStore }} />
          </CardsStoreContext>
        </GoogleOauthStoreContext>,
      );
    });
  });
})();
