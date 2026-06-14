import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getCourseGrades, updateCourseGrade, updateCourseGradeDistribution } from '@/services/courses.service';
import type {
    UpdateCourseGradeDistributionRequest,
    UpdateCourseGradeRequest,
} from '@/services/types';

export const useCourseGrades = (courseId?: string, enabled = true) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ['course-grades', courseId],
        queryFn: () => getCourseGrades(courseId || ''),
        enabled: Boolean(courseId) && enabled,
        staleTime: 2 * 60 * 1000,
    });

    const gradeMutation = useMutation({
        mutationFn: (request: UpdateCourseGradeRequest) => updateCourseGrade(request),
        onSuccess: async (_response, request) => {
            await queryClient.invalidateQueries({ queryKey: ['course-grades', request.courseId] });
        },
    });

    const distributionMutation = useMutation({
        mutationFn: (request: UpdateCourseGradeDistributionRequest) => updateCourseGradeDistribution(request),
        onSuccess: async (_response, request) => {
            await queryClient.invalidateQueries({ queryKey: ['course-grades', request.courseId] });
        },
    });

    return {
        grades: data?.data ?? [],
        total: data?.total ?? 0,
        distribution: data?.distribution ?? null,
        classAverages: data?.classAverages ?? null,
        course: data?.course ?? null,
        isLoading,
        isFetching,
        error,
        refetch,
        updateGrade: gradeMutation.mutateAsync,
        updateDistribution: distributionMutation.mutateAsync,
        isUpdatingGrade: gradeMutation.isPending,
        isUpdatingDistribution: distributionMutation.isPending,
    };
};
