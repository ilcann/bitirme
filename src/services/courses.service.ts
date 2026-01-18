import { MockCourses } from "@/mock/courses";
import type { Course } from "@/types/course";
import type { AudienceKey } from "@/config/audiences";

/**
 * Course Service
 * Handles all course-related API operations
 * Currently uses mock data, ready for API integration
 */

/**
 * Get all courses
 */
export const getAllCourses = async (): Promise<Course[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return MockCourses;
};

/**
 * Get courses filtered by audience
 */
export const getCoursesByAudience = async (audience: AudienceKey): Promise<Course[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return MockCourses.filter(course => course.audience === audience);
};

/**
 * Get a single course by ID
 */
export const getCourseById = async (courseId: string): Promise<Course | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return MockCourses.find(course => course.id === courseId) || null;
};

/**
 * Search courses by query
 */
export const searchCourses = async (query: string, audience?: AudienceKey): Promise<Course[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let courses = MockCourses;
    
    // Filter by audience if provided
    if (audience) {
        courses = courses.filter(course => course.audience === audience);
    }
    
    // Search in code and title
    if (query.trim()) {
        const searchQuery = query.toLowerCase();
        courses = courses.filter(course => 
            course.code.toLowerCase().includes(searchQuery) ||
            course.title.tr.toLowerCase().includes(searchQuery) ||
            course.title.en.toLowerCase().includes(searchQuery)
        );
    }
    
    return courses;
};
