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
    CourseGradeDistribution,
    CourseGradeItem,
    CourseGradeItemType,
    CourseGradeStudent,
    CourseAttendanceStudent,
    CourseAttendanceWeek,
    CourseAttendanceWeekStatus,
    AvailableCourseStudent,
    CourseStudentSortBy,
    EnrollStudentsRequest,
    EnrollStudentsResponse,
    UnenrollStudentsRequest,
    UnenrollStudentsResponse,
    DeleteCourseResponse,
    CourseSortBy,
    GetCourseResponse,
    GetCoursesParams,
    GetCoursesResponse,
    GetAvailableCourseStudentsParams,
    GetEnrolledCourseStudentsParams,
    GetAvailableCourseStudentsResponse,
    GetCourseStudentsResponse,
    GetCourseGradesResponse,
    GetCoursesCompactParams,
    GetCoursesCompactResponse,
    GetCourseAttendanceResponse,
    UpdateCourseGradeDistributionRequest,
    UpdateCourseGradeDistributionResponse,
    UpdateCourseGradeRequest,
    UpdateCourseGradeResponse,
    UpdateCourseAttendanceRequest,
    UpdateCourseAttendanceResponse
} from "./courses.types";

// Materials
export type {
    MaterialSortBy,
    GetMaterialsParams,
    GetMaterialsResponse,
    CreateMaterialRequest,
    MaterialMutationResponse
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
