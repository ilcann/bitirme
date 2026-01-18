import type { Course } from "@/types/course";
import { useState, useMemo } from "react";

interface UseCourseSearchProps {
    courses: Course[];
    audience: string;
    language: string;
}

export const useCourseSearch = ({ courses, audience, language }: UseCourseSearchProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCourses = useMemo(() => {
        return courses
            .filter(course => course.audience === audience)
            .filter(course => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                return (
                    course.code.toLowerCase().includes(query) ||
                    course.title[language as 'tr' | 'en'].toLowerCase().includes(query)
                );
            })
            .sort((a, b) => b.students - a.students);
    }, [courses, audience, searchQuery, language]);

    return {
        searchQuery,
        setSearchQuery,
        filteredCourses
    };
};
