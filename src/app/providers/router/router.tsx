import React, {FC} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {CreateCards} from '../../../pages/createCards';
import {Home} from '../../../pages/home';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
  },
  {
    path: '/create-cards',
    element: <CreateCards/>,
  },
]);

export const AppRouterProvider: FC = () => {
  return (
    <RouterProvider router={appRouter} />
  );
};
