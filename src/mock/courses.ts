type CourseAudience = "common" | "department";

type MaterialType = "lecture" | "assignment" | "exam" | "document" | "video" | "link";

interface CourseMaterial {
    id: string;
    title: {
        tr: string;
        en: string;
    };
    type: MaterialType;
    date: string;
    size?: string;
    url?: string;
    description?: {
        tr: string;
        en: string;
    };
}

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
    materials?: CourseMaterial[];
}

const MockCourses: MockCourse[] = [
    // Common Courses
    { 
        id: "mat103e", 
        code: "MAT 103/E", 
        title: { tr: "Matematik I", en: "Mathematics I" }, 
        students: 1240, 
        color: "chart-1", 
        audience: "common",
        materials: [
            {
                id: "mat103e-1",
                title: { tr: "Ders Notları - Hafta 1", en: "Lecture Notes - Week 1" },
                type: "lecture",
                date: "2026-01-10",
                size: "2.5 MB",
                url: "/files/mat103e-week1.pdf"
            },
            {
                id: "mat103e-2",
                title: { tr: "Ödev 1 - Fonksiyonlar", en: "Assignment 1 - Functions" },
                type: "assignment",
                date: "2026-01-12",
                size: "1.2 MB",
                url: "/files/mat103e-assignment1.pdf",
                description: { 
                    tr: "Teslim tarihi: 19 Ocak 2026", 
                    en: "Due date: January 19, 2026" 
                }
            },
            {
                id: "mat103e-3",
                title: { tr: "Ders Videosu - Limit ve Süreklilik", en: "Lecture Video - Limits and Continuity" },
                type: "video",
                date: "2026-01-13",
                url: "https://youtube.com/watch?v=example"
            },
            {
                id: "mat103e-4",
                title: { tr: "Ek Kaynaklar - Türev", en: "Additional Resources - Derivatives" },
                type: "document",
                date: "2026-01-15",
                size: "3.1 MB",
                url: "/files/mat103e-derivatives.pdf"
            }
        ]
    },
    { 
        id: "mat104e", 
        code: "MAT 104/E", 
        title: { tr: "Matematik II", en: "Mathematics II" }, 
        students: 1180, 
        color: "chart-2", 
        audience: "common",
        materials: [
            {
                id: "mat104e-1",
                title: { tr: "Ders Notları - İntegral", en: "Lecture Notes - Integration" },
                type: "lecture",
                date: "2026-01-11",
                size: "3.2 MB",
                url: "/files/mat104e-integration.pdf"
            },
            {
                id: "mat104e-2",
                title: { tr: "Ara Sınav Soruları", en: "Midterm Exam Questions" },
                type: "exam",
                date: "2026-01-14",
                size: "1.8 MB",
                url: "/files/mat104e-midterm.pdf"
            }
        ]
    },
    
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
export type { MockCourse, CourseAudience, CourseMaterial, MaterialType };
