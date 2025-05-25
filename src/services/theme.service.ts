import { config } from "@/config/configURL";
import apiService from "./api";
import { ITheme } from "@/types/theme.types";
import { ApiResponse } from "@/types/api.types";

export default class ThemeService {
    private endpoint = config.api.endpoint.theme;

    /**
    * Get list of themes
    * @returns List of themes
    **/
    async getTheme(): Promise<ApiResponse<ITheme[]>> {
        const response = await apiService.get<ITheme[]>(this.endpoint.list);
        return response;
    }

    /**
    * Get theme by id
    * @param id - Theme id
    * @returns Theme
    **/
    async getThemeById(id: number): Promise<ApiResponse<ITheme>> {
        const reponse = await apiService.get<ITheme>(this.endpoint.get(id));
        return reponse;
    }

    /**
    * Create new theme
    * @param theme - Theme data
    * @returns Newly created theme
    **/
    async createTheme(theme: ITheme): Promise<ApiResponse<ITheme>> {
        const reponse = await apiService.post<ITheme>(this.endpoint.create, theme);
        return reponse;
    }

    /**
    * Update theme by id
    * @param id - Theme id
    * @param theme - Theme data
    * @returns Updated theme
    **/
    async updateTheme(id: number, theme: ITheme): Promise<ApiResponse<ITheme>> {
        const reponse = await apiService.put<ITheme>(this.endpoint.update(id), theme);
        return reponse;
    }

    /**
    * Delete theme by id
    * @param id - Theme id
    * @returns Deleted theme
    **/
    async deleteTheme(id: number): Promise<ApiResponse<ITheme>> {
        const reponse = await apiService.delete<ITheme>(this.endpoint.delete(id));
        return reponse;
    }
}

export const themeService = new ThemeService();