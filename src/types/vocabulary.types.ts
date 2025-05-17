import { IObject } from "./object.types";
import { IUserVocabulary } from "./user.types";


export interface IVocabulary {
    id: number;
    englishWord: string;
    vietnameseTranslation: string;
    pronunciation: string;
    audioUrl?: string | null;
    examples?: string | null;
    objectId: number;
    object?: IObject;
    createdAt: Date;
    updatedAt: Date;
    userLearned?: IUserVocabulary[];
}