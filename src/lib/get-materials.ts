import { MockMaterials } from "@/mock/materials";

/**
 * Get materials for a specific course
 * Simulates API call: GET /api/courses/:courseId/materials
 */
export const getMaterialsByCourseId = (courseId: string) => {
    return MockMaterials.filter(m => m.courseId === courseId);
};
