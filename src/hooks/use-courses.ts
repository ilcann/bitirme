import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getCourses } from "@/services/courses.service";
import type { GetCoursesParams, CourseSortBy } from "@/services/types";
import type { AudienceKey } from "@/config/audiences";

interface UseCoursesOptions {
    audience?: AudienceKey;
    initialLimit?: number;
}

/**
 * Hook for fetching courses with server-side pagination, filtering, and sorting
 * Uses TanStack Query for data fetching and caching
 */
export const useCourses = ({ audience, initialLimit = 20 }: UseCoursesOptions) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [limit] = useState(initialLimit);
    const [sortBy, setSortBy] = useState<CourseSortBy>("students");

    // Build query params
    const queryParams = useMemo<GetCoursesParams>(() => ({
        audience,
        offset: currentPage * limit,
        limit,
        search: searchQuery || undefined,
        sortBy,
    }), [audience, currentPage, limit, searchQuery, sortBy]);

    // Fetch courses with TanStack Query
    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ["courses", queryParams],
        queryFn: () => getCourses(queryParams),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const courses = data?.data ?? [];
    const total = data?.total ?? 0;
    const hasMore = data?.hasMore ?? false;

    // Pagination calculations
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = hasMore;
    const hasPreviousPage = currentPage > 0;

    // Filter actions
    const updateSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(0); // Reset to first page on search
    };

    const updateSortBy = (value: CourseSortBy) => {
        setSortBy(value);
        setCurrentPage(0); // Reset to first page on sort change
    };

    // Pagination actions
    const goToNextPage = () => {
        if (hasNextPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (hasPreviousPage) {
            setCurrentPage(prev => Math.max(0, prev - 1));
        }
    };

    const goToPage = (page: number) => {
        const validPage = Math.max(0, Math.min(page, totalPages - 1));
        setCurrentPage(validPage);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setSortBy("students");
        setCurrentPage(0);
    };

    return {
        // Data
        courses,
        total,
        
        // Loading states
        isLoading,
        isFetching,
        error,

        // Filter states
        searchQuery,
        sortBy,

        // Pagination state
        currentPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        hasMore,

        // Actions
        updateSearch,
        updateSortBy,
        goToNextPage,
        goToPreviousPage,
        goToPage,
        resetFilters,
        refetch,
    };
};
