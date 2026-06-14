import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateCourseInfo } from '@/services/courses.service';
import type { UpdateCourseInfoRequest } from '@/services/types';

export function useCourseInfoMutation(courseId: string) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (request: UpdateCourseInfoRequest) => updateCourseInfo(request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['course-info', courseId] });
            await queryClient.invalidateQueries({ queryKey: ['course', courseId] });
        },
    });

    return {
        updateInfo: mutation.mutateAsync,
        isUpdating: mutation.isPending,
    };
}