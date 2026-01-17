import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/main";
import HomePage from "@/pages/home";

const router = createBrowserRouter(
  [
    {
      path: "/:lang?",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
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