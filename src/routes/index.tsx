import { createBrowserRouter } from "react-router";

const router = createBrowserRouter(
  [
    {
      path: "*",
      element: <div>404 Not Found</div>,
    }
  ],
  {
    basename: "/ilcan21",
  }
);


export default router;