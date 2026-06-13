import { MockAnnouncements } from "@/mock/announcements";
import type {
    GetAnnouncementsParams,
    GetAnnouncementsResponse
} from "./types";

/**
 * Announcements Service
 * Handles all announcement-related API operations
 * Currently uses mock data, ready for API integration
 */

/**
 * Get announcements with pagination, filtering, and sorting
 * Ready for TanStack Query pagination
 * 
 * @param params - Query parameters
 * @returns Paginated announcements response
 */
export const getAnnouncements = async (params: GetAnnouncementsParams): Promise<GetAnnouncementsResponse> => {
    const {
        audience,
        offset = 0,
        limit = 10,
        search,
        courseIds,
        showOnlyNew = false,
        dateFilter = "all",
        sortBy = "newest"
    } = params;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    let announcements = [...MockAnnouncements];

    // Filter by audience
    if (audience) {
        announcements = announcements.filter(a => a.audience === audience);
    }

    // Filter by new
    if (showOnlyNew) {
        announcements = announcements.filter(a => a.isNew);
    }

    // Filter by course IDs
    if (courseIds && courseIds.length > 0) {
        announcements = announcements.filter(a => courseIds.includes(a.courseId));
    }

    // Filter by date
    if (dateFilter !== "all") {
        const today = new Date("2026-01-18");
        announcements = announcements.filter(a => {
            const announcementDate = new Date(a.date);
            const diffDays = Math.floor((today.getTime() - announcementDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (dateFilter === "today") return diffDays === 0;
            if (dateFilter === "week") return diffDays <= 7;
            if (dateFilter === "month") return diffDays <= 30;
            return true;
        });
    }

    // Filter by search query
    if (search && search.trim()) {
        const searchQuery = search.toLowerCase();
        announcements = announcements.filter(a => 
            a.title.tr.toLowerCase().includes(searchQuery) ||
            a.title.en.toLowerCase().includes(searchQuery) ||
            a.description.tr.toLowerCase().includes(searchQuery) ||
            a.description.en.toLowerCase().includes(searchQuery) ||
            a.courseId.toLowerCase().includes(searchQuery)
        );
    }

    // Sort announcements
    const sorted = [...announcements].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case "oldest":
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            default:
                return 0;
        }
    });

    // Get total count
    const total = sorted.length;

    // Apply pagination
    const paginatedData = sorted.slice(offset, offset + limit);

    // Check if there are more items
    const hasMore = offset + limit < total;

    return {
        data: paginatedData,
        total,
        offset,
        limit,
        hasMore
    };
};
