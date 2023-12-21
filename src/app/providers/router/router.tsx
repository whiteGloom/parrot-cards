import React, {FC} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {CreateCards} from '../../../pages/createCards';
import {Home} from '../../../pages/home';
import {EditCard} from '../../../pages/editCard';
import {Revise} from '../../../pages/revise';

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
]);

export const AppRouterProvider: FC = () => {
  return (
    <RouterProvider router={appRouter} />
  );
};
