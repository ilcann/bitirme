import { useState, useMemo } from "react";
import { MockAnnouncements } from "@/mock/announcements";
import { MockCourses } from "@/mock/courses";
import type { AudienceKey } from "@/config/audiences";

type DateFilter = 'all' | 'today' | 'week' | 'month';

interface UseAnnouncementFilterProps {
    lang: 'tr' | 'en';
    audience: AudienceKey;
}

export const useAnnouncementFilter = ({ lang, audience }: UseAnnouncementFilterProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnlyNew, setShowOnlyNew] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');

    // Get unique courses from announcements, filtered by current audience
    const availableCourses = useMemo(() => {
        const courseIds = [...new Set(MockAnnouncements.map(a => a.courseId))];
        return MockCourses.filter(c => courseIds.includes(c.id) && c.audience === audience);
    }, [audience]);

    // Filter logic
    const filteredAnnouncements = useMemo(() => {
        let filtered = [...MockAnnouncements];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(a => 
                a.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.description[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.courseId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // New filter
        if (showOnlyNew) {
            filtered = filtered.filter(a => a.isNew);
        }

        // Course filter
        if (selectedCourses.length > 0) {
            filtered = filtered.filter(a => selectedCourses.includes(a.courseId));
        }

        // Audience filter (from provider)
        filtered = filtered.filter(a => a.audience === audience);

        // Date filter
        if (dateFilter !== 'all') {
            const today = new Date('2026-01-18');
            filtered = filtered.filter(a => {
                const announcementDate = new Date(a.date);
                const diffDays = Math.floor((today.getTime() - announcementDate.getTime()) / (1000 * 60 * 60 * 24));
                
                if (dateFilter === 'today') return diffDays === 0;
                if (dateFilter === 'week') return diffDays <= 7;
                if (dateFilter === 'month') return diffDays <= 30;
                return true;
            });
        }

        return filtered;
    }, [searchQuery, showOnlyNew, selectedCourses, audience, dateFilter, lang]);

    const newCount = MockAnnouncements.filter(a => a.isNew && a.audience === audience).length;
    const activeFilterCount = (showOnlyNew ? 1 : 0) + (selectedCourses.length > 0 ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0);

    const handleCourseToggle = (courseId: string) => {
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setShowOnlyNew(false);
        setSelectedCourses([]);
        setDateFilter('all');
    };

    return {
        searchQuery,
        setSearchQuery,
        showOnlyNew,
        setShowOnlyNew,
        selectedCourses,
        dateFilter,
        setDateFilter,
        availableCourses,
        filteredAnnouncements,
        newCount,
        activeFilterCount,
        handleCourseToggle,
        clearAllFilters,
    };
};
