import type { AudienceKey } from "@/config/audiences";
import type { Course, CompactCourse } from "@/types/course";

/**
 * Courses Service Types
 */

export type CourseSortBy = "students" | "code" | "title";

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

export interface GetCoursesCompactParams {
    audience?: AudienceKey;
}

export interface GetCoursesCompactResponse {
    data: CompactCourse[];
}
