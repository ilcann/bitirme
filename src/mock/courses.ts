type CourseAudience = "common" | "department";

interface MockCourse {
    id: string;
    code: string;
    title: {
        tr: string;
        en: string;
    };
    students: number;
    color: string;
    audience: CourseAudience;
}

const MockCourses: MockCourse[] = [
    // Common Courses
    { id: "mat103e", code: "MAT 103/E", title: { tr: "Matematik I", en: "Mathematics I" }, students: 1240, color: "chart-1", audience: "common" },
    { id: "mat104e", code: "MAT 104/E", title: { tr: "Matematik II", en: "Mathematics II" }, students: 1180, color: "chart-2", audience: "common" },
    
    // Department Courses
    { id: "mat345e", code: "MAT 345/E", title: { tr: "Olasılık ve İstatistik", en: "Probability and Statistics" }, students: 85, color: "chart-4", audience: "department" },
    { id: "mat471e", code: "MAT 471/E", title: { tr: "Sayısal Analiz", en: "Numerical Analysis" }, students: 62, color: "chart-5", audience: "department" },
    { id: "mate", code: "MATE", title: { tr: "Mühendislik Matematiği", en: "Engineering Mathematics" }, students: 45, color: "chart-1", audience: "department" },
    { id: "mat251e", code: "MAT 251/E", title: { tr: "Diferansiyel Denklemler", en: "Differential Equations" }, students: 78, color: "chart-2", audience: "department" },
    { id: "mat252e", code: "MAT 252/E", title: { tr: "Lineer Cebir", en: "Linear Algebra" }, students: 72, color: "chart-3", audience: "department" },
    { id: "mat361e", code: "MAT 361/E", title: { tr: "Kompleks Fonksiyonlar Teorisi", en: "Complex Functions Theory" }, students: 56, color: "chart-4", audience: "department" },
    { id: "mat362e", code: "MAT 362/E", title: { tr: "Reel Analiz", en: "Real Analysis" }, students: 54, color: "chart-5", audience: "department" },
    { id: "mat381e", code: "MAT 381/E", title: { tr: "Soyut Matematik I", en: "Abstract Mathematics I" }, students: 48, color: "chart-1", audience: "department" },
    { id: "mat382e", code: "MAT 382/E", title: { tr: "Soyut Matematik II", en: "Abstract Mathematics II" }, students: 42, color: "chart-2", audience: "department" },
    { id: "mat491e", code: "MAT 491/E", title: { tr: "Bitirme Projesi I", en: "Graduation Project I" }, students: 35, color: "chart-3", audience: "department" },
    { id: "mat492e", code: "MAT 492/E", title: { tr: "Bitirme Projesi II", en: "Graduation Project II" }, students: 38, color: "chart-4", audience: "department" },
];

export { MockCourses };
export type { MockCourse, CourseAudience };
