import type { AudienceKey } from "@/config/audiences";

interface Announcement {
    id: string;
    title: {
        tr: string;
        en: string;
    };
    description: {
        tr: string;
        en: string;
    };
    date: string;
    courseId: string;
    audience: AudienceKey;
    isNew: boolean;
    createdBy?: number | null;
}

export type { Announcement };