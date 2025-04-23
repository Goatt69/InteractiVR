// Mock data for solar system objects based on the database schema

// Define types based on the schema
export interface SpaceObject {
    id: number;
    name: string;
    objectIdentifier: string; // Matches the object name in GLB file
    thumbnailUrl?: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
    interactable: boolean;
    interactionType?: string;
    highlightColor?: string;
    themeId: number;
    vocabularyItems?: VocabularyItem[];
}

export interface VocabularyItem {
    id: number;
    englishWord: string;
    vietnameseTranslation: string;
    pronunciation: string;
    audioUrl?: string;
    examples: string[];
}

// Mock theme data
export const spaceTheme = {
    id: 1,
    name: "Solar System",
    description: "Learn about our solar system and its planets",
    imageUrl: "/textures/space-background.jpg",
    sceneUrl: "/models/Space.glb",
    difficulty: 2,
    isLocked: false,
};

// Mock objects data matching the Space.glb model
export const solarSystemObjects: SpaceObject[] = [
    {
        id: 1,
        name: "Sun",
        objectIdentifier: "Sun",
        interactable: true,
        interactionType: "look",
        highlightColor: "#FFA500",
        themeId: 1,
        vocabularyItems: [
            {
                id: 101,
                englishWord: "Sun",
                vietnameseTranslation: "Mặt trời",
                pronunciation: "/sʌn/",
                examples: ["The Sun is at the center of our solar system."],
            },
        ],
    },
    {
        id: 2,
        name: "Mercury",
        objectIdentifier: "Mercury",
        interactable: true,
        interactionType: "look",
        highlightColor: "#A9A9A9",
        themeId: 1,
        vocabularyItems: [
            {
                id: 102,
                englishWord: "Mercury",
                vietnameseTranslation: "Sao Thủy",
                pronunciation: "/ˈmɜːrkjəri/",
                examples: [
                    "Mercury is the smallest planet in our solar system.",
                ],
            },
        ],
    },
    {
        id: 3,
        name: "Venus",
        objectIdentifier: "Venus",
        interactable: true,
        interactionType: "look",
        highlightColor: "#E6E6FA",
        themeId: 1,
        vocabularyItems: [
            {
                id: 103,
                englishWord: "Venus",
                vietnameseTranslation: "Sao Kim",
                pronunciation: "/ˈviːnəs/",
                examples: ["Venus is the hottest planet in our solar system."],
            },
        ],
    },
    {
        id: 4,
        name: "Earth",
        objectIdentifier: "Earth",
        interactable: true,
        interactionType: "look",
        highlightColor: "#4169E1",
        themeId: 1,
        vocabularyItems: [
            {
                id: 104,
                englishWord: "Earth",
                vietnameseTranslation: "Trái Đất",
                pronunciation: "/ɜrθ/",
                examples: ["Earth is the only known planet with life."],
            },
        ],
    },
    {
        id: 5,
        name: "Mars",
        objectIdentifier: "Mars",
        interactable: true,
        interactionType: "look",
        highlightColor: "#FF4500",
        themeId: 1,
        vocabularyItems: [
            {
                id: 105,
                englishWord: "Mars",
                vietnameseTranslation: "Sao Hỏa",
                pronunciation: "/mɑrz/",
                examples: ["Mars is known as the Red Planet."],
            },
        ],
    },
    {
        id: 6,
        name: "Jupiter",
        objectIdentifier: "Jupiter",
        interactable: true,
        interactionType: "look",
        highlightColor: "#F4A460",
        themeId: 1,
        vocabularyItems: [
            {
                id: 106,
                englishWord: "Jupiter",
                vietnameseTranslation: "Sao Mộc",
                pronunciation: "/ˈdʒupɪtər/",
                examples: [
                    "Jupiter is the largest planet in our solar system.",
                ],
            },
        ],
    },
    {
        id: 7,
        name: "Saturn",
        objectIdentifier: "Saturn",
        interactable: true,
        interactionType: "look",
        highlightColor: "#F0E68C",
        themeId: 1,
        vocabularyItems: [
            {
                id: 107,
                englishWord: "Saturn",
                vietnameseTranslation: "Sao Thổ",
                pronunciation: "/ˈsætɚn/",
                examples: ["Saturn is famous for its beautiful rings."],
            },
        ],
    },
    {
        id: 8,
        name: "Uranus",
        objectIdentifier: "Uranus",
        interactable: true,
        interactionType: "look",
        highlightColor: "#E0FFFF",
        themeId: 1,
        vocabularyItems: [
            {
                id: 108,
                englishWord: "Uranus",
                vietnameseTranslation: "Sao Thiên Vương",
                pronunciation: "/ˈjurənəs/",
                examples: ["Uranus rotates on its side, unlike other planets."],
            },
        ],
    },
    {
        id: 9,
        name: "Neptune",
        objectIdentifier: "Neptune",
        interactable: true,
        interactionType: "look",
        highlightColor: "#4169E1",
        themeId: 1,
        vocabularyItems: [
            {
                id: 109,
                englishWord: "Neptune",
                vietnameseTranslation: "Sao Hải Vương",
                pronunciation: "/ˈnɛptun/",
                examples: [
                    "Neptune is the windiest planet in our solar system.",
                ],
            },
        ],
    },
];

export default solarSystemObjects;
