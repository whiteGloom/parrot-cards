import React, {FC} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {CreateCards} from '../../../pages/createCards';
import {Home} from '../../../pages/home';
import {EditCard} from '../../../pages/editCard';
import {Revise} from '../../../pages/revise';
import {GoogleOauthPage} from '../../../pages/googleOauth';
import {ExportPage} from '../../../pages/export';
import {PageExportLocal} from '../../../pages/exportLocal';
import {PageImport} from '../../../pages/import';
import {PageImportLocal} from '../../../pages/importLocal';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
  },
  {
    path: '/create-cards',
    element: <CreateCards/>,
  },
  {
    path: '/revise/:cardId',
    element: <Revise/>,
  },
  {
    path: '/edit-card/:cardId',
    element: <EditCard/>,
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
  basename: '/parrot-cards/',
});

export const AppRouterProvider: FC = () => {
  return (
    <RouterProvider router={appRouter} />
  );
};
