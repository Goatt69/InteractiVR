import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";

// Match the Prisma schema exactly
export interface ThemeData {
    name: string;
    description: string | null;
    imageUrl: string | null;
    sceneUrl: string | null;
    skyboxUrl: string | null;
    difficulty: number;
    isLocked: boolean;
}

export interface VocabularyData {
    englishWord: string;
    vietnameseTranslation: string;
    pronunciation: string;
    audioUrl: string | null;
    examples: string[];
}

export interface ObjectData {
    name: string;
    objectIdentifier: string;
    modelUrl: string | null;
    thumbnailUrl: string | null;
    position: { x: number; y: number; z: number } | null;
    rotation: { x: number; y: number; z: number } | null;
    scale: { x: number; y: number; z: number } | null;
    interactable: boolean;
    interactionType: string | null;
    highlightColor: string | null;
    vocabularyItems: VocabularyData[];
}

export interface GLBInspectionResult {
    theme: ThemeData;
    objects: ObjectData[];
}

// Define a type for GLB node
interface GLBNode {
    type: string;
    name: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    geometry?: unknown;
    material?: unknown;
}

// This is a custom hook that follows React rules
export function useGLBInspector(
    glbPath: string,
    themeName: string = "Default Theme",
    themeDescription: string = "Description"
) {
    const [result, setResult] = useState<GLBInspectionResult | null>(null);

    // Always call useGLTF unconditionally as required by React hook rules
    const glbData = useGLTF(glbPath);

    useEffect(() => {
        console.log("Attempting to load GLB from path:", glbPath);

        // Process the GLB data inside the effect
        let nodes: Record<string, GLBNode> = {};

        try {
            console.log("Processing GLB data");
            if (glbData && glbData.nodes) {
                nodes = glbData.nodes as Record<string, GLBNode>;
                console.log(
                    "GLB loaded successfully, nodes:",
                    Object.keys(nodes).length
                );
            } else {
                throw new Error("No nodes found in GLB");
            }
        } catch (error) {
            console.error("Error processing GLB:", error);
            // Fallback nodes if there's an error
            nodes = {
                FallbackSphere: {
                    type: "Mesh",
                    name: "FallbackSphere",
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    scale: { x: 1, y: 1, z: 1 },
                },
            };
        }

        console.log(
            "Processing GLB data from nodes:",
            Object.keys(nodes).length
        );

        // Create a theme object matching the schema exactly
        const themeData: ThemeData = {
            name: themeName,
            description: themeDescription,
            imageUrl: null,
            sceneUrl: glbPath,
            skyboxUrl: "/environments/Sky.hdr",
            difficulty: 1,
            isLocked: false,
        };

        // Process nodes into objects, matching schema exactly
        const objectsData: ObjectData[] = [];

        try {
            Object.entries(nodes).forEach(([nodeName, node]) => {
                console.log("Processing node:", nodeName, "type:", node.type);

                // Only include mesh objects
                if (node.type === "Mesh") {
                    const position = node.position
                        ? {
                              x: node.position.x,
                              y: node.position.y,
                              z: node.position.z,
                          }
                        : { x: 0, y: 0, z: 0 };

                    const rotation = node.rotation
                        ? {
                              x: node.rotation.x,
                              y: node.rotation.y,
                              z: node.rotation.z,
                          }
                        : { x: 0, y: 0, z: 0 };

                    const scale = node.scale
                        ? { x: node.scale.x, y: node.scale.y, z: node.scale.z }
                        : { x: 1, y: 1, z: 1 };

                    objectsData.push({
                        name: nodeName,
                        objectIdentifier: nodeName,
                        modelUrl: null,
                        thumbnailUrl: null,
                        position: position,
                        rotation: rotation,
                        scale: scale,
                        interactable: true,
                        interactionType: "click",
                        highlightColor: null,
                        vocabularyItems: [
                            {
                                englishWord: nodeName,
                                vietnameseTranslation: `${nodeName} in Vietnamese`,
                                pronunciation: `${nodeName} pronunciation`,
                                audioUrl: null,
                                examples: [`This is ${nodeName}`],
                            },
                        ],
                    });
                }
            });
        } catch (error) {
            console.error("Error processing nodes:", error);
            // Add at least one fallback object
            objectsData.push({
                name: "FallbackObject",
                objectIdentifier: "FallbackObject",
                modelUrl: null,
                thumbnailUrl: null,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
                interactable: true,
                interactionType: "click",
                highlightColor: null,
                vocabularyItems: [
                    {
                        englishWord: "FallbackObject",
                        vietnameseTranslation: "Object in Vietnamese",
                        pronunciation: "Object pronunciation",
                        audioUrl: null,
                        examples: [
                            "This is a fallback object created due to an error",
                        ],
                    },
                ],
            });
        }

        console.log("Processed", objectsData.length, "objects from GLB");

        // Always return a result, even if empty
        const finalResult = {
            theme: themeData,
            objects:
                objectsData.length > 0
                    ? objectsData
                    : [
                          {
                              name: "EmptyResult",
                              objectIdentifier: "EmptyResult",
                              modelUrl: null,
                              thumbnailUrl: null,
                              position: { x: 0, y: 0, z: 0 },
                              rotation: { x: 0, y: 0, z: 0 },
                              scale: { x: 1, y: 1, z: 1 },
                              interactable: true,
                              interactionType: "click",
                              highlightColor: null,
                              vocabularyItems: [
                                  {
                                      englishWord: "EmptyResult",
                                      vietnameseTranslation: "No objects found",
                                      pronunciation: "No objects found",
                                      audioUrl: null,
                                      examples: [
                                          "No valid objects were found in the GLB file",
                                      ],
                                  },
                              ],
                          },
                      ],
        };

        setResult(finalResult);
    }, [glbPath, themeName, themeDescription, glbData]);

    return result;
}

// Helper function to download the inspection result as JSON
export function downloadInspectionResult(
    result: GLBInspectionResult,
    filename: string = "glb-data.json"
) {
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);

    console.log("JSON file downloaded:", filename);
}
