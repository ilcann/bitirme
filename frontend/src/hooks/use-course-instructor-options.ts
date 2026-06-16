import { useQuery } from '@tanstack/react-query';

import { getCourseInstructorOptions } from '@/services/courses.service';

type UseCourseInstructorOptionsParams = {
    enabled?: boolean;
};

export const useCourseInstructorOptions = ({ enabled = true }: UseCourseInstructorOptionsParams = {}) => {
    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ['course-instructor-options'],
        queryFn: () => getCourseInstructorOptions(),
        enabled,
        staleTime: 5 * 60 * 1000,
    });

    return {
        options: data ?? [],
        isLoading,
        isFetching,
        error,
        refetch,
    };
};
