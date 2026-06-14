import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '@/services/courses.service';

export const useCourse = (courseId?: string) => {
    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId || ''),
        enabled: Boolean(courseId),
        staleTime: 10 * 60 * 1000,
    });

    return {
        course: data ?? null,
        isLoading,
        isFetching,
        error,
        refetch,
    };
};