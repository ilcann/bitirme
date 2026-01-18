import type { CourseMaterial, MaterialType } from "@/types/course-material";

/**
 * Materials Service Types
 */

export type MaterialSortBy = "newest" | "oldest" | "title";

export interface GetMaterialsParams {
    courseId: string;
    offset?: number;
    limit?: number;
    search?: string;
    types?: MaterialType[];
    sortBy?: MaterialSortBy;
}

export interface GetMaterialsResponse {
    data: CourseMaterial[];
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
}
