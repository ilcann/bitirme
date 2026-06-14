/**
 * Service Types Index
 * Central export point for all service-related types
 */

// Announcements
export type {
    AnnouncementSortBy,
    DateFilter,
    GetAnnouncementsParams,
    GetAnnouncementsResponse,
    AnnouncementCreateRequest,
    AnnouncementMutationResponse,
    GetAnnouncementResponse
} from "./announcements.types";

// Courses
export type {
    CreateCourseRequest,
    CreateCourseResponse,
    CourseStudent,
    CourseAttendanceStudent,
    CourseAttendanceWeek,
    CourseAttendanceWeekStatus,
    AvailableCourseStudent,
    CourseStudentSortBy,
    EnrollStudentsRequest,
    EnrollStudentsResponse,
    DeleteCourseResponse,
    CourseSortBy,
    GetCourseResponse,
    GetCoursesParams,
    GetCoursesResponse,
    GetAvailableCourseStudentsParams,
    GetAvailableCourseStudentsResponse,
    GetCourseStudentsResponse,
    GetCoursesCompactParams,
    GetCoursesCompactResponse,
    GetCourseAttendanceResponse,
    UpdateCourseAttendanceRequest,
    UpdateCourseAttendanceResponse
} from "./courses.types";

// Materials
export type {
    MaterialSortBy,
    GetMaterialsParams,
    GetMaterialsResponse
} from "./materials.types";

// Auth
export type {
    AuthRole,
    AuthSession,
    AuthUser,
    AuthUserResponse,
    LoginRequest,
    LoginResponse,
    LogoutResponse
} from "./auth.types";
