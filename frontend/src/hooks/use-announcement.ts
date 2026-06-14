import { useQuery } from '@tanstack/react-query';
import { getAnnouncementById } from '@/services/announcements.service';

export const useAnnouncement = (announcementId?: string) => {
    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ['announcement', announcementId],
        queryFn: () => getAnnouncementById(announcementId || ''),
        enabled: Boolean(announcementId),
        staleTime: 10 * 60 * 1000,
    });

    return {
        announcement: data?.announcement ?? null,
        isLoading,
        isFetching,
        error,
        refetch,
    };
};