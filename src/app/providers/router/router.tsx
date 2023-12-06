import React, {FC} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {CreateCards} from '../../../pages/createCards';
import {Home} from '../../../pages/home';
import {EditCard} from '../../../pages/editCard';
import {CreateCollection} from '../../../pages/createCollection/ui/createCollection/createCollection';

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
    path: '/create-collection',
    element: <CreateCollection/>,
  },
  {
    path: '/edit-card/:cardId',
    loader: ({params}) => {
      return {
        cardId: params.cardId,
      };
    },
    element: <EditCard/>,
  },
]);

export const AppRouterProvider: FC = () => {
  return (
    <RouterProvider router={appRouter} />
  );
};
