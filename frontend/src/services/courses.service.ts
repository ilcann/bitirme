import { MockCourses } from "@/mock/courses";
import type { Course, CompactCourse } from "@/types/course";
import type { AudienceKey } from "@/config/audiences";
import type {
    GetCoursesParams,
    GetCoursesResponse
} from "./types";

/**
 * Courses Service
 * Handles all course-related API operations
 * Currently uses mock data, ready for API integration
 */

/**
 * Get courses with pagination, filtering, and sorting
 * Ready for TanStack Query pagination
 * 
 * @param params - Query parameters
 * @returns Paginated courses response
 */
export const getCourses = async (params: GetCoursesParams): Promise<GetCoursesResponse> => {
    const {
        audience,
        offset = 0,
        limit = 20,
        search,
        sortBy = "students"
    } = params;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    let courses = MockCourses;

    // Filter by audience if provided
    if (audience) {
        courses = courses.filter(course => course.audience === audience);
    }

    // Search in code and title
    if (search && search.trim()) {
        const searchQuery = search.toLowerCase();
        courses = courses.filter(course => 
            course.code.toLowerCase().includes(searchQuery) ||
            course.title.tr.toLowerCase().includes(searchQuery) ||
            course.title.en.toLowerCase().includes(searchQuery)
        );
    }

    // Sort courses
    const sortedCourses = [...courses].sort((a, b) => {
        switch (sortBy) {
            case "students":
                return b.students - a.students;
            case "code":
                return a.code.localeCompare(b.code);
            case "title":
                return a.title.en.localeCompare(b.title.en);
            default:
                return 0;
        }
    });

    const total = sortedCourses.length;
    const paginatedCourses = sortedCourses.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
        data: paginatedCourses,
        total,
        offset,
        limit,
        hasMore
    };
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
 * Get compact course list for filters
 * Returns all courses in compact format (without students count)
 * 
 * @param audience - Filter by audience
 * @returns Compact course list
 */
export const getCoursesCompact = async (audience?: AudienceKey): Promise<CompactCourse[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 50));

    let courses = MockCourses;

    // Filter by audience if provided
    if (audience) {
        courses = courses.filter(course => course.audience === audience);
    }

    // Map to compact format and sort by code
    return courses
        .map(course => ({
            id: course.id,
            code: course.code,
            title: course.title,
            color: course.color,
            audience: course.audience
        }))
        .sort((a, b) => a.code.localeCompare(b.code));
};
