import { getMaterials } from "@/services/materials.service";

/**
 * Get materials for a specific course (simplified wrapper)
 * @deprecated Use getMaterials from services instead for better control
 */
export const getMaterialsByCourseId = async (courseId: string) => {
    const response = await getMaterials({ 
        courseId, 
        limit: 1000 // Get all materials for now
    });
    return response.data;
};
