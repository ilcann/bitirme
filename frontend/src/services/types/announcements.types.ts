import type { AudienceKey } from "@/config/audiences";
import type { Announcement } from "@/types/announcement";

/**
 * Announcements Service Types
 */

export type AnnouncementSortBy = "newest" | "oldest";
export type DateFilter = "all" | "today" | "week" | "month";

export interface GetAnnouncementsParams {
    audience?: AudienceKey;
    offset?: number;
    limit?: number;
    search?: string;
    courseIds?: string[];
    showOnlyNew?: boolean;
    dateFilter?: DateFilter;
    sortBy?: AnnouncementSortBy;
}

export interface GetAnnouncementsResponse {
    data: Announcement[];
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
}
