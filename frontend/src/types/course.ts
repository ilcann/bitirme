import type { AudienceKey } from "@/config/audiences";

interface CourseLocalizedText {
    tr: string | null;
    en: string | null;
}

interface CourseInfo {
    summary: CourseLocalizedText;
    sectionName: string | null;
    crn: string | null;
    term: CourseLocalizedText;
    startDate: string | null;
    endDate: string | null;
    lastAccessDate: string | null;
    instructors: string[];
    assistants: string[];
    schedule: {
        tr: string[];
        en: string[];
    };
}

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
    info?: CourseInfo | null;
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

export type { Course, CompactCourse, CourseInfo, CourseLocalizedText };