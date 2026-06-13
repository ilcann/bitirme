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

export interface GetCoursesCompactParams {
    audience?: AudienceKey;
}

export interface GetCoursesCompactResponse {
    data: CompactCourse[];
}
