type MaterialType = "lecture" | "assignment" | "exam" | "document" | "video" | "link";

interface CourseMaterial {
    id: number | string;
    courseId: string;
    title: {
        tr: string;
        en: string;
    };
    type: MaterialType;
    date: string;
    size?: string;
    url?: string;
    createdBy?: number;
    fileName?: string;
    originalFileName?: string;
    externalUrl?: string;
    mimeType?: string;
    description?: {
        tr: string;
        en: string;
    };
}

export type { CourseMaterial, MaterialType };