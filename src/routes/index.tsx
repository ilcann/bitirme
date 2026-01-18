import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import MainLayout from "@/pages/layout";
import SuspenseWrapper from "@/components/common/suspence-wrapper";

const HomePage = lazy(() => import("@/pages/public/home"));
const NotFoundedPage = lazy(() => import("@/pages/errors/not-founded"));
const CoursesPage = lazy(() => import("@/pages/public/courses"));
const CoursePage = lazy(() => import("@/pages/public/courses/course"));
const CourseOverviewPage = lazy(() => import("@/pages/public/courses/course/overview"));
const CourseInfoPage = lazy(() => import("@/pages/public/courses/course/info"));
const CourseMaterialsPage = lazy(() => import("@/pages/public/courses/course/materials"));
const AnnouncementsPage = lazy(() => import("@/pages/public/announcements"));
const AnnouncementsDetailPage = lazy(() => import("@/pages/public/announcements/detail"));
const HelpPage = lazy(() => import("@/pages/public/help"));
const AttendancePage = lazy(() => import("@/pages/protected/me/attendance"));
const GradesPage = lazy(() => import("@/pages/protected/me/grades"));
const MyDashboardPage = lazy(() => import("@/pages/protected/me/dashboard"));


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
              element: <SuspenseWrapper><CoursePage /></SuspenseWrapper>,
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
          children: [
            {
              index: true,
              element: <SuspenseWrapper><AnnouncementsPage /></SuspenseWrapper>,
            },
            {
              path: ":announcementId",
              element: <SuspenseWrapper><AnnouncementsDetailPage /></SuspenseWrapper>
            }
          ]
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
  ],
  {
    basename: '/ilcan21/',
  }
);


export default router;