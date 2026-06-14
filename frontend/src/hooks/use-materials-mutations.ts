import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMaterial, deleteMaterial } from '@/services/materials.service';
import type { CreateMaterialRequest } from '@/services/types';

export function useMaterialsMutations(courseId: string) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (request: CreateMaterialRequest) => createMaterial(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['materials', courseId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (materialId: number) => deleteMaterial(courseId, materialId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['materials', courseId] });
    },
  });

  return {
    createMaterial: createMutation.mutateAsync,
    deleteMaterial: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}