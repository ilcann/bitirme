import { useQuery } from '@tanstack/react-query';
import { getCourseInfo } from '@/services/courses.service';

export const useCourseInfo = (courseId?: string) => {
    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ['course-info', courseId],
        queryFn: () => getCourseInfo(courseId || ''),
        enabled: Boolean(courseId),
        staleTime: 5 * 60 * 1000,
    });

    return {
        courseInfo: data ?? null,
        isLoading,
        isFetching,
        error,
        refetch,
    };
};