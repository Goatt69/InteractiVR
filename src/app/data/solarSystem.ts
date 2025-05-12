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

// Updated objects data with proper positions from the GLB model
export const solarSystemObjects: SpaceObject[] = [
    {
        id: 1,
        name: "Sun",
        objectIdentifier: "Sun",
        position: {
            x: -2551.687744140625,
            y: 924.3812866210938,
            z: 168.65525817871094,
        },
        rotation: { x: 0, y: 0, z: 0 },
        scale: {
            x: 91.60579681396484,
            y: 91.60579681396484,
            z: 91.60579681396484,
        },
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
        position: {
            x: -1270.99169921875,
            y: 57.45026779174805,
            z: -533.7667846679688,
        },
        rotation: { x: 0, y: 0, z: 0 },
        scale: {
            x: 36.910072326660156,
            y: 36.910072326660156,
            z: 36.910072326660156,
        },
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
        position: {
            x: -851.9544677734375,
            y: 158.53616333007812,
            z: 714.721923828125,
        },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 23.261962890625, y: 23.261962890625, z: 23.261962890625 },
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
        position: {
            x: 399.10943603515625,
            y: 247.96588134765625,
            z: -351.2386474609375,
        },
        rotation: { x: 2.1031217143714924, y: 0, z: 0 },
        scale: {
            x: 103.71016693115234,
            y: 103.71015930175781,
            z: 103.71015930175781,
        },
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
        position: {
            x: 630.2939453125,
            y: 181.91336059570312,
            z: 398.0990295410156,
        },
        rotation: { x: 0, y: 0, z: 0 },
        scale: {
            x: 55.514347076416016,
            y: 55.514347076416016,
            z: 55.514347076416016,
        },
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
        position: {
            x: 137.38917541503906,
            y: 395.2322692871094,
            z: -1681.9378662109375,
        },
        rotation: { x: 0, y: 0, z: 0 },
        scale: {
            x: 11.691377639770508,
            y: 11.691377639770508,
            z: 11.691377639770508,
        },
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
        position: {
            x: -387.1737976074219,
            y: 346.44964599609375,
            z: 1651.5833740234375,
        },
        rotation: {
            x: -3.141592653589793,
            y: 0.914883703306571,
            z: -3.141592653589793,
        },
        scale: {
            x: 10.635519027709961,
            y: 10.635519981384277,
            z: 10.635519027709961,
        },
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
        position: {
            x: -904.0479736328125,
            y: 241.70620727539062,
            z: -1297.3201904296875,
        },
        rotation: { x: 0, y: 0, z: 0 },
        scale: {
            x: 14.084390640258789,
            y: 14.084390640258789,
            z: 14.084390640258789,
        },
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
        position: { x: 475.6904296875, y: 244.26971435546875, z: 1118.8671875 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: {
            x: 12.219354629516602,
            y: 12.219354629516602,
            z: 12.219354629516602,
        },
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
    {
        id: 10,
        name: "Moon",
        objectIdentifier: "Moon",
        position: {
            x: 134.1045684814453,
            y: 363.4557800292969,
            z: -249.99267578125,
        },
        rotation: { x: 0.08970992056396977, y: 0, z: 0 },
        scale: {
            x: 29.94645881652832,
            y: 29.94646453857422,
            z: 29.94646453857422,
        },
        interactable: true,
        interactionType: "look",
        highlightColor: "#D3D3D3",
        themeId: 1,
        vocabularyItems: [
            {
                id: 110,
                englishWord: "Moon",
                vietnameseTranslation: "Mặt Trăng",
                pronunciation: "/muːn/",
                examples: ["The Moon orbits around the Earth."],
            },
        ],
    },
    {
        id: 11,
        name: "SpaceShip",
        objectIdentifier: "SpaceShip",
        position: {
            x: 216.06051635742188,
            y: 290.6224670410156,
            z: -209.0330810546875,
        },
        rotation: {
            x: 0.36452668048423625,
            y: -0.2710541486332569,
            z: -1.958951760444762,
        },
        scale: {
            x: 0.2458958774805069,
            y: 0.18557848036289215,
            z: 0.25074493885040283,
        },
        interactable: true,
        interactionType: "look",
        highlightColor: "#C0C0C0",
        themeId: 1,
        vocabularyItems: [
            {
                id: 111,
                englishWord: "Spaceship",
                vietnameseTranslation: "Tàu vũ trụ",
                pronunciation: "/ˈspeɪsʃɪp/",
                examples: ["The spaceship travels through the cosmos."],
            },
        ],
    },
    {
        id: 12,
        name: "Astronaut",
        objectIdentifier: "Astronaut",
        position: {
            x: 229.84738159179688,
            y: 256.8412780761719,
            z: -201.7429962158203,
        },
        rotation: {
            x: 2.651941362242991,
            y: -1.2852273199475222,
            z: 2.26254023885141,
        },
        scale: {
            x: 0.19836294651031494,
            y: 0.19836294651031494,
            z: 0.19836294651031494,
        },
        interactable: true,
        interactionType: "look",
        highlightColor: "#FFFFFF",
        themeId: 1,
        vocabularyItems: [
            {
                id: 112,
                englishWord: "Astronaut",
                vietnameseTranslation: "Phi hành gia",
                pronunciation: "/ˈæstrənɔːt/",
                examples: ["The astronaut floated outside the space station."],
            },
        ],
    },
    {
        id: 13,
        name: "SaturnRings",
        objectIdentifier: "SaturnRings",
        position: {
            x: -387.1737976074219,
            y: 346.44964599609375,
            z: 1651.5833740234375,
        },
        rotation: {
            x: 2.6733040597630584,
            y: 0.7153379898162645,
            z: -2.9141035992354185,
        },
        scale: {
            x: 37.21520233154297,
            y: 3.721519947052002,
            z: 37.2151985168457,
        },
        interactable: true,
        interactionType: "look",
        highlightColor: "#FFD700",
        themeId: 1,
        vocabularyItems: [
            {
                id: 113,
                englishWord: "Rings",
                vietnameseTranslation: "Vành đai",
                pronunciation: "/rɪŋz/",
                examples: [
                    "Saturn's rings are made of ice and rock particles.",
                ],
            },
        ],
    },
];

export default solarSystemObjects;
