type CourseAudience = "common" | "department";

interface MockCourse {
    id: string;
    code: string;
    titleKey: string;
    students: number;
    color: string;
    audience: CourseAudience;
}

const MockCourses: MockCourse[] = [
    // Common Courses
    { id: "mat103e", code: "MAT 103/E", titleKey: "courses.mat103e", students: 1240, color: "chart-1", audience: "common" },
    { id: "mat104e", code: "MAT 104/E", titleKey: "courses.mat104e", students: 1180, color: "chart-2", audience: "common" },
    
    // Department Courses
    { id: "mat345e", code: "MAT 345/E", titleKey: "courses.mat345e", students: 85, color: "chart-4", audience: "department" },
    { id: "mat471e", code: "MAT 471/E", titleKey: "courses.mat471e", students: 62, color: "chart-5", audience: "department" },
    { id: "mate", code: "MATE", titleKey: "courses.mate", students: 45, color: "chart-1", audience: "department" },
    { id: "mat251e", code: "MAT 251/E", titleKey: "courses.mat251e", students: 78, color: "chart-2", audience: "department" },
    { id: "mat252e", code: "MAT 252/E", titleKey: "courses.mat252e", students: 72, color: "chart-3", audience: "department" },
    { id: "mat361e", code: "MAT 361/E", titleKey: "courses.mat361e", students: 56, color: "chart-4", audience: "department" },
    { id: "mat362e", code: "MAT 362/E", titleKey: "courses.mat362e", students: 54, color: "chart-5", audience: "department" },
    { id: "mat381e", code: "MAT 381/E", titleKey: "courses.mat381e", students: 48, color: "chart-1", audience: "department" },
    { id: "mat382e", code: "MAT 382/E", titleKey: "courses.mat382e", students: 42, color: "chart-2", audience: "department" },
    { id: "mat491e", code: "MAT 491/E", titleKey: "courses.mat491e", students: 35, color: "chart-3", audience: "department" },
    { id: "mat492e", code: "MAT 492/E", titleKey: "courses.mat492e", students: 38, color: "chart-4", audience: "department" },
];

export { MockCourses };
export type { MockCourse, CourseAudience };
