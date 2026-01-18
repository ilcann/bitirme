import { useQuery } from "@tanstack/react-query";
import { getCoursesCompact } from "@/services/courses.service";
import type { AudienceKey } from "@/config/audiences";

interface UseCoursesCompactOptions {
    audience?: AudienceKey;
}

/**
 * Hook for fetching compact course list (for filters, dropdowns, etc.)
 * Uses TanStack Query for data fetching and caching
 */
export const useCoursesCompact = ({ audience }: UseCoursesCompactOptions = {}) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["courses-compact", audience],
        queryFn: () => getCoursesCompact(audience),
        staleTime: 10 * 60 * 1000, // 10 minutes (course list changes rarely)
    });

    const courses = data ?? [];

    return {
        courses,
        isLoading,
        error,
        refetch,
    };
};
