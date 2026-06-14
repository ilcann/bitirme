import { apiRequest } from "./api";
import type {
    AnnouncementCreateRequest,
    AnnouncementMutationResponse,
    GetAnnouncementResponse,
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

    const query = new URLSearchParams();

    if (audience) {
        query.set('audience', audience);
    }

    query.set('offset', String(offset));
    query.set('limit', String(limit));

    if (search && search.trim()) {
        query.set('search', search.trim());
    }

    if (courseIds && courseIds.length > 0) {
        query.set('courseIds', courseIds.join(','));
    }

    if (showOnlyNew) {
        query.set('showOnlyNew', '1');
    }

    query.set('dateFilter', dateFilter);
    query.set('sortBy', sortBy);

    const response = await apiRequest<{ data: GetAnnouncementsResponse }>(`/public/announcements/index.php?${query.toString()}`);

    return response.data;
};

export const getAnnouncementById = async (announcementId: string): Promise<GetAnnouncementResponse | null> => {
    try {
        return await apiRequest<GetAnnouncementResponse>(`/public/announcements/index.php?announcementId=${encodeURIComponent(announcementId)}`);
    } catch {
        return null;
    }
};

export const createAnnouncement = async (announcement: AnnouncementCreateRequest): Promise<AnnouncementMutationResponse> => {
    return apiRequest<AnnouncementMutationResponse>('/public/announcements/create.php', {
        method: 'POST',
        body: JSON.stringify(announcement),
    });
};

export const deleteAnnouncement = async (announcementId: string): Promise<AnnouncementMutationResponse> => {
    return apiRequest<AnnouncementMutationResponse>('/public/announcements/delete.php', {
        method: 'POST',
        body: JSON.stringify({ id: announcementId }),
    });
};
