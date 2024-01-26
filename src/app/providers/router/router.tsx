import React, {FC} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {CreateCardsPage} from '../../../pages/createCards';
import {HomePage} from '../../../pages/home';
import {EditCardPage} from '../../../pages/editCard';
import {RevisePage} from '../../../pages/revise';
import {GoogleOauthPage} from '../../../pages/googleOauth';
import {ExportPage} from '../../../pages/export';
import {PageExportLocal} from '../../../pages/exportLocal';
import {PageImport} from '../../../pages/import';
import {PageImportLocal} from '../../../pages/importLocal';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>,
  },
  {
    path: '/create-cards',
    element: <CreateCardsPage/>,
  },
  {
    path: '/revise/:cardId',
    element: <RevisePage/>,
  },
  {
    path: '/edit-card/:cardId',
    element: <EditCardPage/>,
  },
  {
    path: '/google-oauth',
    element: <GoogleOauthPage/>,
  },
  {
    path: '/export',
    element: <ExportPage/>,
  },
  {
    path: '/export-local',
    element: <PageExportLocal/>,
  },
  {
    path: '/import',
    element: <PageImport/>,
  },
  {
    path: '/import-local',
    element: <PageImportLocal/>,
  },
], {
  basename: '/parrot-cards',
});

export const AppRouterProvider: FC = () => {
  return (
    <RouterProvider router={appRouter} />
  );
};
