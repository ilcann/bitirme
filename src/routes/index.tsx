import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/main";

const router = createBrowserRouter(
  [
    {
      path: "/:lang?",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <div>Home Page</div>,
        },
        {
          path: "*",
          element: <div>404 Not Found</div>,
        }
      ],
    },
  ]
);


export default router;