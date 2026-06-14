import type { AudienceKey } from "@/config/audiences";
import type { Course, CompactCourse } from "@/types/course";

/**
 * Courses Service Types
 */

export type CourseSortBy = "students" | "code" | "title";

export type CourseStudentSortBy = "name" | "studentNumber";

export interface GetCoursesParams {
    audience?: AudienceKey;
    offset?: number;
    limit?: number;
    search?: string;
    sortBy?: CourseSortBy;
}

export interface GetCoursesResponse {
    data: Course[];
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
}

export interface GetCourseResponse {
    course: Course;
}

export interface CreateCourseRequest {
    code: string;
    titleTr: string;
    titleEn: string;
    audience: AudienceKey;
    color: string;
    id?: string;
}

export interface CreateCourseResponse {
    success: boolean;
    message: string;
    course: Course;
}

export interface DeleteCourseResponse {
    success: boolean;
    message: string;
    course: Course;
}

export interface CourseStudent {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    studentNumber: string | null;
    enrolledAt: string;
}

export interface GetCourseStudentsResponse {
    success: boolean;
    message: string;
    course: Course;
    data: CourseStudent[];
    total: number;
}

export interface GetCoursesCompactParams {
    audience?: AudienceKey;
}

export interface GetCoursesCompactResponse {
    data: CompactCourse[];
}
