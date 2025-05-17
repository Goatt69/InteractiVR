import { IObject } from "./object.types";

export interface ITheme {
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