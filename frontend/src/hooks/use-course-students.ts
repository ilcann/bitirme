import { useQuery } from '@tanstack/react-query';
import { getCourseStudents } from '@/services/courses.service';
import type { CourseStudentSortBy } from '@/services/types';

export const useCourseStudents = (
    courseId?: string,
    sortBy: CourseStudentSortBy = 'name',
    enabled = true
) => {
    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ['course-students', courseId, sortBy],
        queryFn: () => getCourseStudents(courseId || '', sortBy),
        enabled: Boolean(courseId) && enabled,
        staleTime: 5 * 60 * 1000,
    });

    return {
        students: data?.data ?? [],
        total: data?.total ?? 0,
        course: data?.course ?? null,
        isLoading,
        isFetching,
        error,
        refetch,
    };
};