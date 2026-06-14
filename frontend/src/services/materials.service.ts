import { apiRequest } from "./api";
import type {
    CreateMaterialRequest,
    GetMaterialsParams,
    GetMaterialsResponse,
    MaterialMutationResponse
} from "./types";

export const getMaterials = async (params: GetMaterialsParams): Promise<GetMaterialsResponse> => {
    const {
        courseId,
        offset = 0,
        limit = 10,
        search,
        types,
        sortBy = "newest"
    } = params;

    const query = new URLSearchParams();

    query.set('courseId', courseId);
    query.set('offset', String(offset));
    query.set('limit', String(limit));
    query.set('sortBy', sortBy);

    if (search && search.trim()) {
        query.set('search', search.trim());
    }

    if (types && types.length > 0) {
        query.set('types', types.join(','));
    }

    const response = await apiRequest<{ data: GetMaterialsResponse }>(`/public/courses/materials.php?${query.toString()}`);

    return response.data;
};

export const createMaterial = async (request: CreateMaterialRequest): Promise<MaterialMutationResponse> => {
    const formData = new FormData();

    formData.append('courseId', request.courseId);
    formData.append('titleTr', request.titleTr);
    formData.append('titleEn', request.titleEn);
    formData.append('type', request.type);

    if (request.descriptionTr) {
        formData.append('descriptionTr', request.descriptionTr);
    }

    if (request.descriptionEn) {
        formData.append('descriptionEn', request.descriptionEn);
    }

    if (request.externalUrl) {
        formData.append('externalUrl', request.externalUrl);
    }

    if (request.file) {
        formData.append('file', request.file);
    }

    const response = await apiRequest<MaterialMutationResponse>('/public/courses/materials.php', {
        method: 'POST',
        body: formData,
    });

    return response;
};

export const deleteMaterial = async (courseId: string, materialId: number): Promise<MaterialMutationResponse> => {
    const query = new URLSearchParams();

    query.set('courseId', courseId);
    query.set('id', String(materialId));

    return apiRequest<MaterialMutationResponse>(`/public/courses/materials.php?${query.toString()}`, {
        method: 'DELETE',
    });
};
