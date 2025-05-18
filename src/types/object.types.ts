import { ITheme } from "./theme.types";
import { IVocabulary } from "./vocabulary.types";


export interface IObject {
    name: string;
    objectIdentifier: string;
    thumbnailUrl?: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
    interactable: boolean;
    themeId: number;
    theme?: ITheme;
    vocabularyItems?: IVocabulary[];
    createdAt: Date;
    updatedAt: Date;
}