import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getCourseAttendance, updateCourseAttendance } from '@/services/courses.service';
import type { UpdateCourseAttendanceRequest } from '@/services/types';

export const useCourseAttendance = (courseId?: string, enabled = true) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ['course-attendance', courseId],
        queryFn: () => getCourseAttendance(courseId || ''),
        enabled: Boolean(courseId) && enabled,
        staleTime: 2 * 60 * 1000,
    });

    const mutation = useMutation({
        mutationFn: (request: UpdateCourseAttendanceRequest) => updateCourseAttendance(request),
        onSuccess: async (_response, request) => {
            await queryClient.invalidateQueries({ queryKey: ['course-attendance', request.courseId] });
        },
    });

    return {
        attendance: data?.data ?? [],
        total: data?.total ?? 0,
        weekCount: data?.weekCount ?? 14,
        course: data?.course ?? null,
        isLoading,
        isFetching,
        isUpdating: mutation.isPending,
        error,
        refetch,
        updateAttendance: mutation.mutateAsync,
    };
};