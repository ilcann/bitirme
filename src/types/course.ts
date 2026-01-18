import type { AudienceKey } from "@/config/audiences";
import type { CourseMaterial } from "./course-material";

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
    materials?: CourseMaterial[];
}

export type { Course };