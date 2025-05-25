import { config } from "@/config/configURL"
import apiService from "./api";
import { IObject } from "@/types/object.types";
import { ApiResponse } from "@/types/api.types";

export default class ObjectService {
    private endpoint = config.api.endpoint.objects

    /**
     * Get list of objects
     * @returns List of objects
     */
    async getObjects(): Promise<ApiResponse<IObject[]>> {
        const response = await apiService.get<IObject[]>(this.endpoint.list);
        return response;
    }

    /**
     * Get object by id
     * @param id - Object id
     * @returns Object
     */
    async getObjectById(id: number): Promise<ApiResponse<IObject>> {
        const response = await apiService.get<IObject>(this.endpoint.get(id));
        return response;
    }

}

export const objectService = new ObjectService();