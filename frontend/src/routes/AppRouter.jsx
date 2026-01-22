import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { routes } from "./routesConfig";

const router = createBrowserRouter(createRoutesFromElements(routes));

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
