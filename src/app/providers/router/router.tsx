import React, {FC} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {CreateCards} from '../../../pages/createCards';
import {Home} from '../../../pages/home';
import {EditCard} from '../../../pages/editCard';

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
