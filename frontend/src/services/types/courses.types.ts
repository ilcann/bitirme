import type { AudienceKey } from "@/config/audiences";
import type { Course, CompactCourse } from "@/types/course";

/**
 * Courses Service Types
 */

export type CourseSortBy = "students" | "code" | "title";

export type CourseStudentSortBy = "name" | "studentNumber";

export type CourseAttendanceWeekStatus = boolean | null;

export type CourseGradeItemType = 'midterm' | 'final' | 'project' | 'homework' | 'quiz';

export interface CourseGradeDistribution {
    midtermCount: number;
    finalCount: number;
    projectCount: number;
    homeworkCount: number;
    quizCount: number;
    midtermWeight: number;
    finalWeight: number;
    projectWeight: number;
    homeworkWeight: number;
    quizWeight: number;
}

export interface CourseGradeItem {
    itemType: CourseGradeItemType;
    itemNumber: number;
    score: number | null;
    updatedAt: string | null;
}

export interface CourseGradeStudent {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    studentNumber: string | null;
    enrolledAt: string;
    grades: CourseGradeItem[];
    averageScore: number | null;
}

export interface CourseGradeClassAverageItem {
    itemType: CourseGradeItemType;
    itemNumber: number;
    averageScore: number | null;
}

export interface CourseGradeClassAverages {
    overall: number | null;
    items: CourseGradeClassAverageItem[];
}

export interface GetCourseGradesResponse {
    success: boolean;
    message: string;
    course: Course;
    distribution: CourseGradeDistribution;
    classAverages: CourseGradeClassAverages;
    data: CourseGradeStudent[];
    total: number;
}

export interface UpdateCourseGradeDistributionRequest {
    courseId: string;
    distribution: CourseGradeDistribution;
}

export interface UpdateCourseGradeDistributionResponse {
    success: boolean;
    message: string;
    course: Course;
    distribution: CourseGradeDistribution;
}

export interface UpdateCourseGradeRequest {
    courseId: string;
    studentId: number;
    itemType: CourseGradeItemType;
    itemNumber: number;
    score: number | null;
}

export interface UpdateCourseGradeResponse {
    success: boolean;
    message: string;
    course: Course;
    itemType: CourseGradeItemType;
    itemNumber: number;
}

export interface CourseAttendanceWeek {
    weekNumber: number;
    isPresent: CourseAttendanceWeekStatus;
    updatedAt: string | null;
}

export interface CourseAttendanceStudent {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    studentNumber: string | null;
    enrolledAt: string;
    weeks: CourseAttendanceWeek[];
    presentCount: number;
    absentCount: number;
    markedCount: number;
    presentRate: number;
    absentRate: number;
}

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

export interface CourseStudent {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    studentNumber: string | null;
    enrolledAt: string;
}

export interface AvailableCourseStudent {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    studentNumber: string | null;
}

export interface GetAvailableCourseStudentsParams {
    courseId: string;
    offset?: number;
    limit?: number;
    search?: string;
}

export interface GetAvailableCourseStudentsResponse {
    success: boolean;
    message: string;
    course: Course;
    data: AvailableCourseStudent[];
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
}

export interface EnrollStudentsRequest {
    courseId: string;
    studentIds: number[];
}

export interface EnrollStudentsResponse {
    success: boolean;
    message: string;
    course: Course;
    data: AvailableCourseStudent[];
    enrolledCount: number;
}

export interface GetCourseStudentsResponse {
    success: boolean;
    message: string;
    course: Course;
    data: CourseStudent[];
    total: number;
}

export interface GetCourseAttendanceResponse {
    success: boolean;
    message: string;
    course: Course;
    weekCount: number;
    data: CourseAttendanceStudent[];
    total: number;
}

export interface UpdateCourseAttendanceRequest {
    courseId: string;
    studentId: number;
    weekNumber: number;
    isPresent: boolean;
}

export interface UpdateCourseAttendanceResponse {
    success: boolean;
    message: string;
    course: Course;
    student: CourseAttendanceStudent;
    weekNumber: number;
}

export interface GetCoursesCompactParams {
    audience?: AudienceKey;
}

export interface GetCoursesCompactResponse {
    data: CompactCourse[];
}
