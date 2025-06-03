import { ITheme } from "./theme.types";
import { IVocabulary } from "./vocabulary.types";

enum Role {
    ADMIN = 'admin',
    USER = 'user'
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: IUser; // IUser no longer contains password field
}

export interface RegisterResponse {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
}

export interface ICreateUser {
    name: string;
    email: string;
    password: string;
}

export interface IUser {
    id:        string;
    email:     string;
    name:      string;
    createdAt: Date;
    updatedAt: Date;
    role:      Role;
    userProgress?: IUserProgress[];
    userAchievements?: IUserAchievement[];
    userVocabulary?: IUserVocabulary[];
}

export interface IUserAchievement {
    id: number;
    userId: string;
    user?: IUser;
    type: string;
    description: string;
    earnedAt: Date;
}

export interface IUserProgress {
    id: number;
    userId: string;
    user?: IUser;
    themeId: number;
    theme?: ITheme;
    progress: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserVocabulary {
    id: string;
    userId: string;
    user?: IUser;
    vocabularyId: number;
    vocabulary?: IVocabulary;
    learned: boolean;
    lastReviewed?: Date | null;
    createdAt: Date;
}