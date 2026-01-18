import { createBrowserRouter } from "react-router";
import HomePage from "@/pages/public/home";
import NotFoundedPage from "@/pages/errors/not-founded";
import CourseOverviewPage from "@/pages/public/courses/course";
import CourseInfoPage from "@/pages/public/courses/course/info";
import AnnouncementsPage from "@/pages/public/announcements";
import HelpPage from "@/pages/public/help";
import AttendancePage from "@/pages/protected/me/attendance";
import GradesPage from "@/pages/protected/me/grades";
import MyDashboardPage from "@/pages/protected/me/dashboard";
import CourseMaterialsPage from "@/pages/public/courses/course/materials";
import MainLayout from "@/pages/layout";
import CoursesPage from "@/pages/public/courses";

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
          path: "courses",
          children: [
            {
              index: true,
              element: <CoursesPage />,
            },
            {
              path: ":courseId",
              children: [
                {
                  index: true,
                  element: <CourseOverviewPage />,
                },
                {
                  path: "materials",
                  element: <CourseMaterialsPage />,
                },
                {
                  path: "info",
                  element: <CourseInfoPage />
                }
              ]
            }
          ]    
        },
        {
          path: "me",
          children: [
            {
              index: true,
              element: <MyDashboardPage />,
            },
            {
              path: "grades",
              element: <GradesPage />,
            },
            {
              path: "attendance",
              element: <AttendancePage />,
            }
          ]
        },
        {
          path: "announcements",
          element: <AnnouncementsPage />,
        },
        {
          path: "help",
          element: <HelpPage />,
        },
        {
          path: "*",
          element: <NotFoundedPage />,
        }
      ],
    },
  ]
);


export default router;