import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getAnnouncements, type GetAnnouncementsParams, type DateFilter } from "@/services/announcements.service";
import type { AudienceKey } from "@/config/audiences";

interface UseAnnouncementsOptions {
    audience?: AudienceKey;
    initialLimit?: number;
}

export const useAnnouncements = ({ audience, initialLimit = 10 }: UseAnnouncementsOptions) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnlyNew, setShowOnlyNew] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<DateFilter>("all");
    const [currentPage, setCurrentPage] = useState(0);
    const [limit] = useState(initialLimit);

    // Build query params
    const queryParams = useMemo<GetAnnouncementsParams>(() => ({
        audience,
        offset: currentPage * limit,
        limit,
        search: searchQuery || undefined,
        courseIds: selectedCourses.length > 0 ? selectedCourses : undefined,
        showOnlyNew,
        dateFilter,
        sortBy: "newest" as const,
    }), [audience, currentPage, limit, searchQuery, selectedCourses, showOnlyNew, dateFilter]);

    // Fetch announcements with TanStack Query
    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: ["announcements", queryParams],
        queryFn: () => getAnnouncements(queryParams),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const announcements = data?.data ?? [];
    const total = data?.total ?? 0;
    const hasMore = data?.hasMore ?? false;

    // Pagination calculations
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = hasMore;
    const hasPreviousPage = currentPage > 0;

    // Filter actions
    const updateSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(0); // Reset to first page
    };

    const updateShowOnlyNew = (value: boolean) => {
        setShowOnlyNew(value);
        setCurrentPage(0);
    };

    const toggleCourse = (courseId: string) => {
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
        setCurrentPage(0);
    };

    const updateDateFilter = (value: DateFilter) => {
        setDateFilter(value);
        setCurrentPage(0);
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setShowOnlyNew(false);
        setSelectedCourses([]);
        setDateFilter("all");
        setCurrentPage(0);
    };

    // Pagination actions
    const goToNextPage = () => {
        if (hasNextPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (hasPreviousPage) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Active filter count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchQuery) count++;
        if (showOnlyNew) count++;
        if (selectedCourses.length > 0) count++;
        if (dateFilter !== "all") count++;
        return count;
    }, [searchQuery, showOnlyNew, selectedCourses.length, dateFilter]);

    return {
        // Data
        announcements,
        total,
        
        // Pagination state
        currentPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        
        // Loading states
        isLoading,
        isFetching,
        error,
        
        // Filter state
        searchQuery,
        showOnlyNew,
        selectedCourses,
        dateFilter,
        activeFilterCount,
        
        // Filter actions
        updateSearch,
        updateShowOnlyNew,
        toggleCourse,
        updateDateFilter,
        clearAllFilters,
        
        // Pagination actions
        goToNextPage,
        goToPreviousPage,
    };
};
