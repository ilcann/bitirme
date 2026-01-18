import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { CourseMaterial as Material , MaterialType } from "@/mock/courses";

type SortOption = "newest" | "oldest" | "title";

export const useMaterialFilter = (materials: Material[] | undefined) => {
    const { i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<MaterialType | "all">("all");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    
    const filteredAndSortedMaterials = useMemo(() => {
        if (!materials) return [];

        let filtered = materials;
        
        // Filter by type
        if (filterType !== "all") {
            filtered = filtered.filter(m => m.type === filterType);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(m => 
                m.title[i18n.language as 'tr' | 'en'].toLowerCase().includes(query) ||
                (m.description && m.description[i18n.language as 'tr' | 'en'].toLowerCase().includes(query))
            );
        }

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case "oldest":
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case "title":
                    return a.title[i18n.language as 'tr' | 'en'].localeCompare(
                        b.title[i18n.language as 'tr' | 'en']
                    );
                default:
                    return 0;
            }
        });

        return sorted;
    }, [materials, filterType, sortBy, searchQuery, i18n.language]);

    return {
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        sortBy,
        setSortBy,
        filteredAndSortedMaterials,
    };
};
