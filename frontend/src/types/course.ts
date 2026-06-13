import type { AudienceKey } from "@/config/audiences";

interface Course {
    id: string;
    code: string;
    title: {
        tr: string;
        en: string;
    };
    students: number;
    color: string;
    audience: AudienceKey;
}

interface CompactCourse {
    id: string;
    code: string;
    title: {
        tr: string;
        en: string;
    };
    color: string;
    audience: AudienceKey;
}

export type { Course, CompactCourse };