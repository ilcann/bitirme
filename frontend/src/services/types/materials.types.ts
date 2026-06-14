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

export interface CreateMaterialRequest {
    courseId: string;
    titleTr: string;
    titleEn: string;
    descriptionTr?: string;
    descriptionEn?: string;
    type: MaterialType;
    externalUrl?: string;
    file?: File | null;
}

export interface MaterialMutationResponse {
    success: boolean;
    message: string;
    material: CourseMaterial;
}
