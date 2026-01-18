import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import MainLayout from "@/pages/layout";
import SuspenseWrapper from "@/components/common/suspence-wrapper";

const HomePage = lazy(() => import("@/pages/public/home"));
const NotFoundedPage = lazy(() => import("@/pages/errors/not-founded"));
const CourseOverviewPage = lazy(() => import("@/pages/public/courses/course"));
const CourseInfoPage = lazy(() => import("@/pages/public/courses/course/info"));
const CourseMaterialsPage = lazy(() => import("@/pages/public/courses/course/materials"));
const AnnouncementsPage = lazy(() => import("@/pages/public/announcements"));
const HelpPage = lazy(() => import("@/pages/public/help"));
const AttendancePage = lazy(() => import("@/pages/protected/me/attendance"));
const GradesPage = lazy(() => import("@/pages/protected/me/grades"));
const MyDashboardPage = lazy(() => import("@/pages/protected/me/dashboard"));
const CoursesPage = lazy(() => import("@/pages/public/courses"));


const router = createBrowserRouter(
  [
    {
      path: "/:lang?",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <SuspenseWrapper><HomePage /></SuspenseWrapper>,
        },
        {
          path: "courses",
          children: [
            {
              index: true,
              element: <SuspenseWrapper><CoursesPage /></SuspenseWrapper>,
            },
            {
              path: ":courseId",
              children: [
                {
                  index: true,
                  element: <SuspenseWrapper><CourseOverviewPage /></SuspenseWrapper>,
                },
                {
                  path: "materials",
                  element: <SuspenseWrapper><CourseMaterialsPage /></SuspenseWrapper>,
                },
                {
                  path: "info",
                  element: <SuspenseWrapper><CourseInfoPage /></SuspenseWrapper>
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
              element: <SuspenseWrapper><MyDashboardPage /></SuspenseWrapper>,
            },
            {
              path: "grades",
              element: <SuspenseWrapper><GradesPage /></SuspenseWrapper>,
            },
            {
              path: "attendance",
              element: <SuspenseWrapper><AttendancePage /></SuspenseWrapper>,
            }
          ]
        },
        {
          path: "announcements",
          element: <SuspenseWrapper><AnnouncementsPage /></SuspenseWrapper>,
        },
        {
          path: "help",
          element: <SuspenseWrapper><HelpPage /></SuspenseWrapper>,
        },
        {
          path: "*",
          element: <SuspenseWrapper><NotFoundedPage /></SuspenseWrapper>,
        }
      ],
    },
  ]
);


export default router;