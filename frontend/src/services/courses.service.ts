import type { Course, CompactCourse } from "@/types/course";
import { apiRequest } from "./api";
import type { AudienceKey } from "@/config/audiences";
import type {
    CreateCourseRequest,
    CreateCourseResponse,
    EnrollStudentsRequest,
    EnrollStudentsResponse,
    GetAvailableCourseStudentsParams,
    CourseStudentSortBy,
    DeleteCourseResponse,
    GetCoursesParams,
    GetCoursesResponse,
    GetCoursesCompactResponse,
    GetCourseStudentsResponse,
    GetCourseGradesResponse,
    GetAvailableCourseStudentsResponse,
    GetCourseAttendanceResponse,
    UpdateCourseGradeDistributionRequest,
    UpdateCourseGradeDistributionResponse,
    UpdateCourseGradeRequest,
    UpdateCourseGradeResponse,
    UpdateCourseAttendanceRequest,
    UpdateCourseAttendanceResponse
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

    const query = new URLSearchParams();

    if (audience) {
        query.set('audience', audience);
    }

    query.set('offset', String(offset));
    query.set('limit', String(limit));
    query.set('sortBy', sortBy);

    if (search && search.trim()) {
        query.set('search', search.trim());
    }

    const response = await apiRequest<{ data: GetCoursesResponse }>(`/public/courses/index.php?${query.toString()}`);

    return response.data;
};

/**
 * Get a single course by ID
 */
export const getCourseById = async (courseId: string): Promise<Course | null> => {
    try {
        const response = await apiRequest<{ course: Course }>(`/public/courses/index.php?courseId=${encodeURIComponent(courseId)}`);

        return response.course;
    } catch {
        return null;
    }
};

/**
 * Get compact course list for filters
 * Returns all courses in compact format (without students count)
 * 
 * @param audience - Filter by audience
 * @returns Compact course list
 */
export const getCoursesCompact = async (audience?: AudienceKey): Promise<CompactCourse[]> => {
    const query = new URLSearchParams();

    query.set('compact', '1');

    if (audience) {
        query.set('audience', audience);
    }

    const response = await apiRequest<GetCoursesCompactResponse>(`/public/courses/index.php?${query.toString()}`);

    return response.data;
};

export const createCourse = async (course: CreateCourseRequest): Promise<CreateCourseResponse> => {
    return apiRequest<CreateCourseResponse>('/public/courses/create.php', {
        method: 'POST',
        body: JSON.stringify(course),
    });
};

export const deleteCourse = async (courseId: string): Promise<DeleteCourseResponse> => {
    return apiRequest<DeleteCourseResponse>('/public/courses/delete.php', {
        method: 'POST',
        body: JSON.stringify({ id: courseId }),
    });
};

export const getCourseStudents = async (
    courseId: string,
    sortBy: CourseStudentSortBy = 'name'
): Promise<GetCourseStudentsResponse> => {
    const query = new URLSearchParams();

    query.set('courseId', courseId);
    query.set('students', '1');
    query.set('sortBy', sortBy);

    return apiRequest<GetCourseStudentsResponse>(`/public/courses/students.php?${query.toString()}`);
};

export const getCourseAttendance = async (courseId: string): Promise<GetCourseAttendanceResponse> => {
    const query = new URLSearchParams();

    query.set('courseId', courseId);

    return apiRequest<GetCourseAttendanceResponse>(`/public/courses/attendance.php?${query.toString()}`);
};

export const getCourseGrades = async (courseId: string): Promise<GetCourseGradesResponse> => {
    const query = new URLSearchParams();

    query.set('courseId', courseId);

    return apiRequest<GetCourseGradesResponse>(`/public/courses/grades.php?${query.toString()}`);
};

export const updateCourseGradeDistribution = async (
    request: UpdateCourseGradeDistributionRequest
): Promise<UpdateCourseGradeDistributionResponse> => {
    const query = new URLSearchParams();

    query.set('courseId', request.courseId);

    return apiRequest<UpdateCourseGradeDistributionResponse>(`/public/courses/grades.php?${query.toString()}`, {
        method: 'POST',
        body: JSON.stringify({ distribution: request.distribution }),
    });
};

export const updateCourseGrade = async (
    request: UpdateCourseGradeRequest
): Promise<UpdateCourseGradeResponse> => {
    const query = new URLSearchParams();

    query.set('courseId', request.courseId);

    return apiRequest<UpdateCourseGradeResponse>(`/public/courses/grades.php?${query.toString()}`, {
        method: 'POST',
        body: JSON.stringify({
            studentId: request.studentId,
            itemType: request.itemType,
            itemNumber: request.itemNumber,
            score: request.score,
        }),
    });
};

export const updateCourseAttendance = async (
    request: UpdateCourseAttendanceRequest
): Promise<UpdateCourseAttendanceResponse> => {
    const query = new URLSearchParams();

    query.set('courseId', request.courseId);

    return apiRequest<UpdateCourseAttendanceResponse>(`/public/courses/attendance.php?${query.toString()}`, {
        method: 'POST',
        body: JSON.stringify({
            studentId: request.studentId,
            weekNumber: request.weekNumber,
            isPresent: request.isPresent,
        }),
    });
};

export const getAvailableCourseStudents = async (
    params: GetAvailableCourseStudentsParams
): Promise<GetAvailableCourseStudentsResponse> => {
    const query = new URLSearchParams();

    query.set('courseId', params.courseId);
    query.set('offset', String(params.offset ?? 0));
    query.set('limit', String(params.limit ?? 20));

    if (params.search && params.search.trim()) {
        query.set('search', params.search.trim());
    }

    return apiRequest<GetAvailableCourseStudentsResponse>(`/public/courses/available.php?${query.toString()}`);
};

export const enrollStudents = async (request: EnrollStudentsRequest): Promise<EnrollStudentsResponse> => {
    return apiRequest<EnrollStudentsResponse>('/public/courses/enroll.php', {
        method: 'POST',
        body: JSON.stringify(request),
    });
};
