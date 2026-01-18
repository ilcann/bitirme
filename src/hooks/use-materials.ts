import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMaterials } from "@/services/materials.service";
import type { MaterialSortBy, GetMaterialsParams } from "@/services/types";
import type { MaterialType } from "@/types/course-material";

interface UseMaterialsOptions {
    courseId: string;
    initialLimit?: number;
}

/**
 * Hook for fetching materials with server-side pagination, filtering, and sorting
 * Uses TanStack Query for data fetching and caching
 */
export const useMaterials = ({ courseId, initialLimit = 20 }: UseMaterialsOptions) => {
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(initialLimit);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<MaterialType[]>([]);
    const [sortBy, setSortBy] = useState<MaterialSortBy>("newest");

    const queryParams: GetMaterialsParams = {
        courseId,
        offset,
        limit,
        search: searchQuery || undefined,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        sortBy,
    };

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["materials", queryParams],
        queryFn: () => getMaterials(queryParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Pagination helpers
    const goToNextPage = () => {
        if (data?.hasMore) {
            setOffset(prev => prev + limit);
        }
    };

    const goToPreviousPage = () => {
        setOffset(prev => Math.max(0, prev - limit));
    };

    const goToPage = (page: number) => {
        setOffset(page * limit);
    };

    const resetPagination = () => {
        setOffset(0);
    };

    // Filter helpers
    const toggleType = (type: MaterialType) => {
        setSelectedTypes(prev => {
            const exists = prev.includes(type);
            const newTypes = exists 
                ? prev.filter(t => t !== type)
                : [...prev, type];
            resetPagination(); // Reset to first page when filter changes
            return newTypes;
        });
    };

    const clearTypes = () => {
        setSelectedTypes([]);
        resetPagination();
    };

    const updateSearch = (query: string) => {
        setSearchQuery(query);
        resetPagination(); // Reset to first page when search changes
    };

    const updateSortBy = (newSortBy: MaterialSortBy) => {
        setSortBy(newSortBy);
        resetPagination(); // Reset to first page when sort changes
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setSelectedTypes([]);
        setSortBy("newest");
        resetPagination();
    };

    // Computed values
    const currentPage = Math.floor(offset / limit);
    const totalPages = data ? Math.ceil(data.total / limit) : 0;
    const hasNextPage = data?.hasMore ?? false;
    const hasPreviousPage = offset > 0;

    return {
        // Data
        materials: data?.data ?? [],
        total: data?.total ?? 0,
        
        // Pagination state
        currentPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        offset,
        limit,
        
        // Loading states
        isLoading,
        isFetching,
        isError,
        error,
        
        // Filter state
        searchQuery,
        selectedTypes,
        sortBy,
        
        // Pagination actions
        goToNextPage,
        goToPreviousPage,
        goToPage,
        setLimit,
        
        // Filter actions
        updateSearch,
        toggleType,
        clearTypes,
        updateSortBy,
        clearAllFilters,
        
        // Utility
        refetch,
    };
};
