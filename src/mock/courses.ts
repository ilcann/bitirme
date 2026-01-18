import type { Course } from "@/types/course";
import { MockMaterials } from "./materials";

const MockCourses: Course[] = [
    // Common Courses
    { 
        id: "mat103e", 
        code: "MAT 103/E", 
        title: { tr: "Matematik I", en: "Mathematics I" }, 
        students: 1240, 
        color: "chart-1", 
        audience: "common",
        materials: MockMaterials.filter(m => m.courseId === "mat103e")
    },
    { 
        id: "mat104e", 
        code: "MAT 104/E", 
        title: { tr: "Matematik II", en: "Mathematics II" }, 
        students: 1180, 
        color: "chart-2", 
        audience: "common",
        materials: MockMaterials.filter(m => m.courseId === "mat104e")
    },
    
    // Department Courses
    { 
        id: "mat345e", 
        code: "MAT 345/E", 
        title: { tr: "Olasılık ve İstatistik", en: "Probability and Statistics" }, 
        students: 85, 
        color: "chart-4", 
        audience: "department",
        materials: MockMaterials.filter(m => m.courseId === "mat345e")
    },
    { 
        id: "mat471e", 
        code: "MAT 471/E", 
        title: { tr: "Sayısal Analiz", en: "Numerical Analysis" }, 
        students: 62, 
        color: "chart-5", 
        audience: "department",
        materials: MockMaterials.filter(m => m.courseId === "mat471e")
    },
    { 
        id: "mate", 
        code: "MATE", 
        title: { tr: "Mühendislik Matematiği", en: "Engineering Mathematics" }, 
        students: 45, 
        color: "chart-1", 
        audience: "department",
        materials: MockMaterials.filter(m => m.courseId === "mate")
    },
    { 
        id: "mat251e", 
        code: "MAT 251/E", 
        title: { tr: "Diferansiyel Denklemler", en: "Differential Equations" }, 
        students: 78, 
        color: "chart-2", 
        audience: "department",
        materials: MockMaterials.filter(m => m.courseId === "mat251e")
    },
    { 
        id: "mat252e", 
        code: "MAT 252/E", 
        title: { tr: "Lineer Cebir", en: "Linear Algebra" }, 
        students: 72, 
        color: "chart-3", 
        audience: "department",
        materials: MockMaterials.filter(m => m.courseId === "mat252e")
    },
    { 
        id: "mat361e", 
        code: "MAT 361/E", 
        title: { tr: "Kompleks Fonksiyonlar Teorisi", en: "Complex Functions Theory" }, 
        students: 56, 
        color: "chart-4", 
        audience: "department",
        materials: MockMaterials.filter(m => m.courseId === "mat361e")
    },
    { 
        id: "mat362e", 
        code: "MAT 362/E", 
        title: { tr: "Reel Analiz", en: "Real Analysis" }, 
        students: 54, 
        color: "chart-5", 
        audience: "department",
        materials: MockMaterials.filter(m => m.courseId === "mat362e")
    },
    { 
        id: "mat381e", 
        code: "MAT 381/E", 
        title: { tr: "Soyut Matematik I", en: "Abstract Mathematics I" }, 
        students: 48, 
        color: "chart-1", 
        audience: "department",
        materials: MockMaterials.filter(m => m.courseId === "mat381e")
    },
    { 
        id: "mat382e", 
        code: "MAT 382/E", 
        title: { tr: "Soyut Matematik II", en: "Abstract Mathematics II" }, 
        students: 42, 
        color: "chart-2", 
        audience: "department",
        materials: MockMaterials.filter(m => m.courseId === "mat382e")
    },
    { 
        id: "mat491e", 
        code: "MAT 491/E", 
        title: { tr: "Bitirme Projesi I", en: "Graduation Project I" }, 
        students: 35, 
        color: "chart-3", 
        audience: "department",
        materials: MockMaterials.filter(m => m.courseId === "mat491e")
    },
    { 
        id: "mat492e", 
        code: "MAT 492/E", 
        title: { tr: "Bitirme Projesi II", en: "Graduation Project II" }, 
        students: 38, 
        color: "chart-4", 
        audience: "department",
        materials: MockMaterials.filter(m => m.courseId === "mat492e")
    },
];

export { MockCourses };
