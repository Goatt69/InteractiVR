import { IObject } from "./object.types";

export interface ITheme {
    id?: number;
    name: string;
    description?: string;
    imageUrl?: string;
    sceneUrl?: string;
    skyboxUrl?: string;
    difficulty: number;
    isLocked: boolean;
    requiredThemeId?: number;
    requiredTheme?: ITheme;
    dependentThemes?: ITheme[];
    objects?: IObject[]
}

// Theme interface with progress tracking for display purposes
export interface ThemeWithProgress {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    difficulty: number;
    isLocked: boolean;
    progress: number;
    totalItems: number;
    completedItems: number;
}