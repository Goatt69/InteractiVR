import { config } from "@/config/configURL";
import apiService from "./api";
import { IVocabulary } from "@/types/vocabulary.types";
import { ApiResponse } from "@/types/api.types";


export default class VocabularyService {
    private endpoint = config.api.endpoint.vocabulary;

    /**
     * Get list of vocabulary items by object ID
     * @param objectId - Object id
     * @returns List of vocabulary items
     */
    async getVocabularyByObjectId(objectId: number): Promise<ApiResponse<IVocabulary[]>> {
        const response = await apiService.get<IVocabulary[]>(this.endpoint.getByObjectId(objectId));
        return response;
    }
}

export const vocabularyService = new VocabularyService();