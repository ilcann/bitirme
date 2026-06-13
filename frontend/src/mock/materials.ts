import type { CourseMaterial } from "@/types/course-material";

export const MockMaterials: CourseMaterial[] = [
    // MAT 103/E Materials
    {
        id: "mat103e-1",
        courseId: "mat103e",
        title: { tr: "Ders Notları - Hafta 1", en: "Lecture Notes - Week 1" },
        type: "lecture",
        date: "2026-01-10",
        size: "2.5 MB",
        url: "/files/mat103e-week1.pdf"
    },
    {
        id: "mat103e-2",
        courseId: "mat103e",
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
        courseId: "mat103e",
        title: { tr: "Ders Videosu - Limit ve Süreklilik", en: "Lecture Video - Limits and Continuity" },
        type: "video",
        date: "2026-01-13",
        url: "https://youtube.com/watch?v=example"
    },
    {
        id: "mat103e-4",
        courseId: "mat103e",
        title: { tr: "Ek Kaynaklar - Türev", en: "Additional Resources - Derivatives" },
        type: "document",
        date: "2026-01-15",
        size: "3.1 MB",
        url: "/files/mat103e-derivatives.pdf"
    },
    {
        id: "mat103e-5",
        courseId: "mat103e",
        title: { tr: "Ders Notları - Hafta 2", en: "Lecture Notes - Week 2" },
        type: "lecture",
        date: "2026-01-16",
        size: "2.8 MB",
        url: "/files/mat103e-week2.pdf"
    },
    {
        id: "mat103e-6",
        courseId: "mat103e",
        title: { tr: "Çözümlü Alıştırmalar - Türev", en: "Solved Exercises - Derivatives" },
        type: "document",
        date: "2026-01-17",
        size: "1.5 MB",
        url: "/files/mat103e-exercises.pdf"
    },

    // MAT 104/E Materials
    {
        id: "mat104e-1",
        courseId: "mat104e",
        title: { tr: "Ders Notları - İntegral", en: "Lecture Notes - Integration" },
        type: "lecture",
        date: "2026-01-11",
        size: "3.2 MB",
        url: "/files/mat104e-integration.pdf"
    },
    {
        id: "mat104e-2",
        courseId: "mat104e",
        title: { tr: "Ara Sınav Soruları", en: "Midterm Exam Questions" },
        type: "exam",
        date: "2026-01-14",
        size: "1.8 MB",
        url: "/files/mat104e-midterm.pdf"
    },
    {
        id: "mat104e-3",
        courseId: "mat104e",
        title: { tr: "Ders Videosu - Belirli İntegral", en: "Lecture Video - Definite Integral" },
        type: "video",
        date: "2026-01-15",
        url: "https://youtube.com/watch?v=example2"
    },
    {
        id: "mat104e-4",
        courseId: "mat104e",
        title: { tr: "Ödev 1 - İntegral Hesaplama", en: "Assignment 1 - Integration Calculation" },
        type: "assignment",
        date: "2026-01-16",
        size: "1.4 MB",
        url: "/files/mat104e-assignment1.pdf",
        description: { 
            tr: "Teslim tarihi: 23 Ocak 2026", 
            en: "Due date: January 23, 2026" 
        }
    },
    {
        id: "mat104e-5",
        courseId: "mat104e",
        title: { tr: "Ek Kaynaklar - Seri ve Diziler", en: "Additional Resources - Series and Sequences" },
        type: "document",
        date: "2026-01-17",
        size: "2.1 MB",
        url: "/files/mat104e-series.pdf"
    },

    // MAT 345/E Materials
    {
        id: "mat345e-1",
        courseId: "mat345e",
        title: { tr: "Ders Notları - Olasılık Temel Kavramlar", en: "Lecture Notes - Probability Fundamentals" },
        type: "lecture",
        date: "2026-01-09",
        size: "2.7 MB",
        url: "/files/mat345e-week1.pdf"
    },
    {
        id: "mat345e-2",
        courseId: "mat345e",
        title: { tr: "Ders Videosu - Rastgele Değişkenler", en: "Lecture Video - Random Variables" },
        type: "video",
        date: "2026-01-11",
        url: "https://youtube.com/watch?v=example3"
    },
    {
        id: "mat345e-3",
        courseId: "mat345e",
        title: { tr: "Ödev 1 - Olasılık Dağılımları", en: "Assignment 1 - Probability Distributions" },
        type: "assignment",
        date: "2026-01-13",
        size: "1.1 MB",
        url: "/files/mat345e-assignment1.pdf",
        description: { 
            tr: "Teslim tarihi: 20 Ocak 2026", 
            en: "Due date: January 20, 2026" 
        }
    },
    {
        id: "mat345e-4",
        courseId: "mat345e",
        title: { tr: "İstatistik Tabloları", en: "Statistical Tables" },
        type: "document",
        date: "2026-01-14",
        size: "0.8 MB",
        url: "/files/mat345e-tables.pdf"
    },
    {
        id: "mat345e-5",
        courseId: "mat345e",
        title: { tr: "Ders Notları - Hipotez Testleri", en: "Lecture Notes - Hypothesis Testing" },
        type: "lecture",
        date: "2026-01-16",
        size: "3.0 MB",
        url: "/files/mat345e-week2.pdf"
    },

    // MAT 471/E Materials
    {
        id: "mat471e-1",
        courseId: "mat471e",
        title: { tr: "Ders Notları - Hata Analizi", en: "Lecture Notes - Error Analysis" },
        type: "lecture",
        date: "2026-01-10",
        size: "2.3 MB",
        url: "/files/mat471e-week1.pdf"
    },
    {
        id: "mat471e-2",
        courseId: "mat471e",
        title: { tr: "Python Kodları - Sayısal Yöntemler", en: "Python Code - Numerical Methods" },
        type: "link",
        date: "2026-01-12",
        url: "https://github.com/example/numerical-methods"
    },
    {
        id: "mat471e-3",
        courseId: "mat471e",
        title: { tr: "Ödev 1 - Newton-Raphson Metodu", en: "Assignment 1 - Newton-Raphson Method" },
        type: "assignment",
        date: "2026-01-14",
        size: "1.3 MB",
        url: "/files/mat471e-assignment1.pdf",
        description: { 
            tr: "Teslim tarihi: 21 Ocak 2026", 
            en: "Due date: January 21, 2026" 
        }
    },
    {
        id: "mat471e-4",
        courseId: "mat471e",
        title: { tr: "Ders Notları - Lineer Sistemler", en: "Lecture Notes - Linear Systems" },
        type: "lecture",
        date: "2026-01-17",
        size: "2.9 MB",
        url: "/files/mat471e-week2.pdf"
    },

    // MAT 251/E Materials
    {
        id: "mat251e-1",
        courseId: "mat251e",
        title: { tr: "Ders Notları - 1. Mertebe Denklemler", en: "Lecture Notes - First Order Equations" },
        type: "lecture",
        date: "2026-01-09",
        size: "2.6 MB",
        url: "/files/mat251e-week1.pdf"
    },
    {
        id: "mat251e-2",
        courseId: "mat251e",
        title: { tr: "Ders Videosu - Laplace Dönüşümü", en: "Lecture Video - Laplace Transform" },
        type: "video",
        date: "2026-01-12",
        url: "https://youtube.com/watch?v=example4"
    },
    {
        id: "mat251e-3",
        courseId: "mat251e",
        title: { tr: "Çözümlü Örnekler - Diferansiyel Denklemler", en: "Solved Examples - Differential Equations" },
        type: "document",
        date: "2026-01-15",
        size: "2.2 MB",
        url: "/files/mat251e-examples.pdf"
    },
    {
        id: "mat251e-4",
        courseId: "mat251e",
        title: { tr: "Ödev 1 - Homojen Denklemler", en: "Assignment 1 - Homogeneous Equations" },
        type: "assignment",
        date: "2026-01-16",
        size: "1.0 MB",
        url: "/files/mat251e-assignment1.pdf",
        description: { 
            tr: "Teslim tarihi: 23 Ocak 2026", 
            en: "Due date: January 23, 2026" 
        }
    },

    // MAT 252/E Materials
    {
        id: "mat252e-1",
        courseId: "mat252e",
        title: { tr: "Ders Notları - Vektör Uzayları", en: "Lecture Notes - Vector Spaces" },
        type: "lecture",
        date: "2026-01-10",
        size: "2.4 MB",
        url: "/files/mat252e-week1.pdf"
    },
    {
        id: "mat252e-2",
        courseId: "mat252e",
        title: { tr: "Ödev 1 - Matris İşlemleri", en: "Assignment 1 - Matrix Operations" },
        type: "assignment",
        date: "2026-01-13",
        size: "1.2 MB",
        url: "/files/mat252e-assignment1.pdf",
        description: { 
            tr: "Teslim tarihi: 20 Ocak 2026", 
            en: "Due date: January 20, 2026" 
        }
    },
    {
        id: "mat252e-3",
        courseId: "mat252e",
        title: { tr: "Ders Notları - Özdeğerler ve Özvektörler", en: "Lecture Notes - Eigenvalues and Eigenvectors" },
        type: "lecture",
        date: "2026-01-17",
        size: "2.8 MB",
        url: "/files/mat252e-week2.pdf"
    },
    {
        id: "mat252e-4",
        courseId: "mat252e",
        title: { tr: "MATLAB Kodları - Lineer Cebir", en: "MATLAB Code - Linear Algebra" },
        type: "link",
        date: "2026-01-17",
        url: "https://github.com/example/linear-algebra"
    },

    // MAT 361/E Materials
    {
        id: "mat361e-1",
        courseId: "mat361e",
        title: { tr: "Ders Notları - Kompleks Sayılar", en: "Lecture Notes - Complex Numbers" },
        type: "lecture",
        date: "2026-01-11",
        size: "2.5 MB",
        url: "/files/mat361e-week1.pdf"
    },
    {
        id: "mat361e-2",
        courseId: "mat361e",
        title: { tr: "Ders Videosu - Cauchy-Riemann Denklemleri", en: "Lecture Video - Cauchy-Riemann Equations" },
        type: "video",
        date: "2026-01-14",
        url: "https://youtube.com/watch?v=example5"
    },
    {
        id: "mat361e-3",
        courseId: "mat361e",
        title: { tr: "Ödev 1 - Analitik Fonksiyonlar", en: "Assignment 1 - Analytic Functions" },
        type: "assignment",
        date: "2026-01-16",
        size: "1.4 MB",
        url: "/files/mat361e-assignment1.pdf",
        description: { 
            tr: "Teslim tarihi: 23 Ocak 2026", 
            en: "Due date: January 23, 2026" 
        }
    },

    // MAT 362/E Materials
    {
        id: "mat362e-1",
        courseId: "mat362e",
        title: { tr: "Ders Notları - Metrik Uzaylar", en: "Lecture Notes - Metric Spaces" },
        type: "lecture",
        date: "2026-01-10",
        size: "3.1 MB",
        url: "/files/mat362e-week1.pdf"
    },
    {
        id: "mat362e-2",
        courseId: "mat362e",
        title: { tr: "Çözümlü Problemler - Yakınsaklık", en: "Solved Problems - Convergence" },
        type: "document",
        date: "2026-01-13",
        size: "1.9 MB",
        url: "/files/mat362e-problems.pdf"
    },
    {
        id: "mat362e-3",
        courseId: "mat362e",
        title: { tr: "Ödev 1 - Sıralı Uzaylar", en: "Assignment 1 - Sequential Spaces" },
        type: "assignment",
        date: "2026-01-15",
        size: "1.1 MB",
        url: "/files/mat362e-assignment1.pdf",
        description: { 
            tr: "Teslim tarihi: 22 Ocak 2026", 
            en: "Due date: January 22, 2026" 
        }
    },

    // MAT 381/E Materials
    {
        id: "mat381e-1",
        courseId: "mat381e",
        title: { tr: "Ders Notları - Gruplar", en: "Lecture Notes - Groups" },
        type: "lecture",
        date: "2026-01-09",
        size: "2.7 MB",
        url: "/files/mat381e-week1.pdf"
    },
    {
        id: "mat381e-2",
        courseId: "mat381e",
        title: { tr: "Ödev 1 - Permütasyon Grupları", en: "Assignment 1 - Permutation Groups" },
        type: "assignment",
        date: "2026-01-12",
        size: "1.0 MB",
        url: "/files/mat381e-assignment1.pdf",
        description: { 
            tr: "Teslim tarihi: 19 Ocak 2026", 
            en: "Due date: January 19, 2026" 
        }
    },
    {
        id: "mat381e-3",
        courseId: "mat381e",
        title: { tr: "Ders Notları - Halkalar ve Cisimler", en: "Lecture Notes - Rings and Fields" },
        type: "lecture",
        date: "2026-01-16",
        size: "2.9 MB",
        url: "/files/mat381e-week2.pdf"
    },

    // MAT 382/E Materials
    {
        id: "mat382e-1",
        courseId: "mat382e",
        title: { tr: "Ders Notları - Galois Teorisi", en: "Lecture Notes - Galois Theory" },
        type: "lecture",
        date: "2026-01-11",
        size: "3.3 MB",
        url: "/files/mat382e-week1.pdf"
    },
    {
        id: "mat382e-2",
        courseId: "mat382e",
        title: { tr: "Ders Videosu - Cebirsel Uzantılar", en: "Lecture Video - Algebraic Extensions" },
        type: "video",
        date: "2026-01-14",
        url: "https://youtube.com/watch?v=example6"
    },
    {
        id: "mat382e-3",
        courseId: "mat382e",
        title: { tr: "Ödev 1 - Alan Uzantıları", en: "Assignment 1 - Field Extensions" },
        type: "assignment",
        date: "2026-01-17",
        size: "1.3 MB",
        url: "/files/mat382e-assignment1.pdf",
        description: { 
            tr: "Teslim tarihi: 24 Ocak 2026", 
            en: "Due date: January 24, 2026" 
        }
    },

    // MAT 491/E Materials
    {
        id: "mat491e-1",
        courseId: "mat491e",
        title: { tr: "Proje Önerisi Şablonu", en: "Project Proposal Template" },
        type: "document",
        date: "2026-01-10",
        size: "0.5 MB",
        url: "/files/mat491e-template.pdf"
    },
    {
        id: "mat491e-2",
        courseId: "mat491e",
        title: { tr: "Literatür Taraması Kılavuzu", en: "Literature Review Guide" },
        type: "document",
        date: "2026-01-13",
        size: "1.2 MB",
        url: "/files/mat491e-literature.pdf"
    },
    {
        id: "mat491e-3",
        courseId: "mat491e",
        title: { tr: "Sunum İpuçları", en: "Presentation Tips" },
        type: "link",
        date: "2026-01-15",
        url: "https://example.com/presentation-tips"
    },

    // MAT 492/E Materials
    {
        id: "mat492e-1",
        courseId: "mat492e",
        title: { tr: "Tez Yazım Kılavuzu", en: "Thesis Writing Guide" },
        type: "document",
        date: "2026-01-09",
        size: "2.1 MB",
        url: "/files/mat492e-thesis-guide.pdf"
    },
    {
        id: "mat492e-2",
        courseId: "mat492e",
        title: { tr: "LaTeX Şablonu", en: "LaTeX Template" },
        type: "link",
        date: "2026-01-11",
        url: "https://github.com/example/thesis-template"
    },
    {
        id: "mat492e-3",
        courseId: "mat492e",
        title: { tr: "Jüri Sunumu Formatı", en: "Jury Presentation Format" },
        type: "document",
        date: "2026-01-14",
        size: "0.8 MB",
        url: "/files/mat492e-presentation-format.pdf"
    },

    // MATE Materials
    {
        id: "mate-1",
        courseId: "mate",
        title: { tr: "Ders Notları - Fourier Serileri", en: "Lecture Notes - Fourier Series" },
        type: "lecture",
        date: "2026-01-12",
        size: "2.8 MB",
        url: "/files/mate-week1.pdf"
    },
    {
        id: "mate-2",
        courseId: "mate",
        title: { tr: "Ödev 1 - Fourier Analizi", en: "Assignment 1 - Fourier Analysis" },
        type: "assignment",
        date: "2026-01-15",
        size: "1.1 MB",
        url: "/files/mate-assignment1.pdf",
        description: { 
            tr: "Teslim tarihi: 22 Ocak 2026", 
            en: "Due date: January 22, 2026" 
        }
    },
    {
        id: "mate-3",
        courseId: "mate",
        title: { tr: "MATLAB Kodları - Fourier Dönüşümü", en: "MATLAB Code - Fourier Transform" },
        type: "link",
        date: "2026-01-16",
        url: "https://github.com/example/fourier-matlab"
    },
];
