/**
 * Service Types Index
 * Central export point for all service-related types
 */

// Announcements
export type {
    AnnouncementSortBy,
    DateFilter,
    GetAnnouncementsParams,
    GetAnnouncementsResponse
} from "./announcements.types";

// Courses
export type {
    CreateCourseRequest,
    CreateCourseResponse,
    DeleteCourseResponse,
    CourseSortBy,
    GetCourseResponse,
    GetCoursesParams,
    GetCoursesResponse,
    GetCoursesCompactParams,
    GetCoursesCompactResponse
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
