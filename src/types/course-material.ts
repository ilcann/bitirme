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

export type { CourseMaterial, MaterialType };