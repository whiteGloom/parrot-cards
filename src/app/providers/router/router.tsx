import React, {FC} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {CreateCardsPage} from '../../../pages/createCards';
import {HomePage} from '../../../pages/home';
import {EditCardPage} from '../../../pages/editCard';
import {RevisePage} from '../../../pages/revise';
import {GoogleOauthPage} from '../../../pages/googleOauth';
import {ExportPage} from '../../../pages/export';
import {ExportLocalPage} from '../../../pages/exportLocal';
import {ImportPage} from '../../../pages/import';
import {ImportLocalPage} from '../../../pages/importLocal';
import {HomePath} from '../../../shared/routes/home';
import {CreateCardsPath} from '../../../shared/routes/createCards';
import {RevisePath} from '../../../shared/routes/revise';
import {EditCardPath} from '../../../shared/routes/editCard';
import {GoogleOauthPath} from '../../../shared/routes/googleOauth';
import {ExportPath} from '../../../shared/routes/export';
import {ExportLocalPath} from '../../../shared/routes/exportLocal';
import {ImportLocalPath} from '../../../shared/routes/importLocal';
import {ImportPath} from '../../../shared/routes/import';

export const appRouter = createBrowserRouter([
  {
    path: HomePath,
    element: <HomePage/>,
  },
  {
    path: CreateCardsPath,
    element: <CreateCardsPage/>,
  },
  {
    path: RevisePath,
    element: <RevisePage/>,
  },
  {
    path: EditCardPath,
    element: <EditCardPage/>,
  },
  {
    path: GoogleOauthPath,
    element: <GoogleOauthPage/>,
  },
  {
    path: ExportPath,
    element: <ExportPage/>,
  },
  {
    path: ExportLocalPath,
    element: <ExportLocalPage/>,
  },
  {
    path: ImportPath,
    element: <ImportPage/>,
  },
  {
    path: ImportLocalPath,
    element: <ImportLocalPage/>,
  },
], {
  basename: '/parrot-cards',
});

export const AppRouterProvider: FC = () => {
  return (
    <RouterProvider router={appRouter} />
  );
};
