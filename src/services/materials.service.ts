import { MockMaterials } from "@/mock/materials";
import type { CourseMaterial, MaterialType } from "@/types/course-material";

/**
 * Materials Service
 * Handles all course materials-related API operations
 * Currently uses mock data, ready for API integration
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

/**
 * Get materials for a course with pagination, filtering, and sorting
 * Ready for TanStack Query pagination
 * 
 * @param params - Query parameters
 * @returns Paginated materials response
 */
export const getMaterials = async (params: GetMaterialsParams): Promise<GetMaterialsResponse> => {
    const {
        courseId,
        offset = 0,
        limit = 10,
        search,
        types,
        sortBy = "newest"
    } = params;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    let materials = MockMaterials.filter(material => material.courseId === courseId);

    // Filter by types
    if (types && types.length > 0) {
        materials = materials.filter(material => types.includes(material.type));
    }

    // Filter by search query
    if (search && search.trim()) {
        const searchQuery = search.toLowerCase();
        materials = materials.filter(material => 
            material.title.tr.toLowerCase().includes(searchQuery) ||
            material.title.en.toLowerCase().includes(searchQuery) ||
            (material.description?.tr.toLowerCase().includes(searchQuery)) ||
            (material.description?.en.toLowerCase().includes(searchQuery))
        );
    }

    // Sort materials
    const sorted = [...materials].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case "oldest":
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case "title":
                // Sort by current language (default to English)
                return a.title.en.localeCompare(b.title.en);
            default:
                return 0;
        }
    });

    // Get total count
    const total = sorted.length;

    // Apply pagination
    const paginatedData = sorted.slice(offset, offset + limit);

    // Check if there are more items
    const hasMore = offset + limit < total;

    return {
        data: paginatedData,
        total,
        offset,
        limit,
        hasMore
    };
};
