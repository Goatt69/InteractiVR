'use client';

import { useState, useRef } from 'react';
import { GLBInspectionResult } from '../utils/glbInspector';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Define types for our GLB inspection
interface VocabularyItem {
  englishWord: string;
  vietnameseTranslation: string;
  pronunciation: string;
  audioUrl: string | null;
  examples: string[];
}

interface InspectedObject {
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
  vocabularyItems: VocabularyItem[];
}

// Helper function to download the inspection result as JSON
function downloadInspectionResult(result: GLBInspectionResult, filename: string = "glb-data.json") {
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

    console.log('JSON file downloaded:', filename);
}

export default function GLBInspector() {
  const [result, setResult] = useState<GLBInspectionResult | null>(null);
  const [glbPath, setGlbPath] = useState<string>('/models/Space.glb');
  const [themeName, setThemeName] = useState<string>('Solar System');
  const [themeDescription, setThemeDescription] = useState<string>('Explore the solar system in VR');
  const [isInspecting, setIsInspecting] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<GLTFLoader>(new GLTFLoader());

  // Function to parse GLB file and extract object data
  const inspectGLBFile = () => {
    setIsInspecting(true);
    setProgress(10);
    setStatus('Loading GLB file...');
    setError(null);
    
    // Create a new scene to load the model into
    const scene = new THREE.Scene();
    const loader = loaderRef.current;
    
    // Load the GLB file
    loader.load(
      // URL
      glbPath,
      
      // onLoad callback
      (gltf) => {
        setProgress(50);
        setStatus('Processing scene objects...');
        
        try {
          scene.add(gltf.scene);
          
          // Create the theme based on user input
          const theme = {
            name: themeName,
            description: themeDescription,
            imageUrl: null,
            sceneUrl: glbPath,
            skyboxUrl: "/environments/Sky.hdr",
            difficulty: 1,
            isLocked: false,
          };
          
          // Extract objects from the scene
          const objects: InspectedObject[] = [];
          let processedCount = 0;
          
          // Function to traverse the scene and find all meshes
          gltf.scene.traverse((object) => {
            // Only process Mesh objects
            if (object instanceof THREE.Mesh) {
              processedCount++;
              setProgress(50 + Math.min(processedCount * 2, 40)); // Progress from 50% to 90%
              
              console.log('Found object:', object.name);
              
              // Extract position, rotation, and scale
              const position = object.position ? {
                x: object.position.x,
                y: object.position.y,
                z: object.position.z
              } : null;
              
              const rotation = object.rotation ? {
                x: object.rotation.x,
                y: object.rotation.y,
                z: object.rotation.z
              } : null;
              
              const scale = object.scale ? {
                x: object.scale.x,
                y: object.scale.y,
                z: object.scale.z
              } : null;
              
              // Create a vocabulary item based on the object name
              const vocab: VocabularyItem = {
                englishWord: object.name,
                vietnameseTranslation: `${object.name} in Vietnamese`, // This would need manual editing later
                pronunciation: `${object.name} pronunciation`, // This would need manual editing later
                audioUrl: null,
                examples: [`This is a ${object.name}`]
              };
              
              // Add object to the list
              objects.push({
                name: object.name,
                objectIdentifier: object.name,
                modelUrl: null,
                thumbnailUrl: null,
                position: position,
                rotation: rotation,
                scale: scale,
                interactable: true,
                interactionType: "click",
                highlightColor: null,
                vocabularyItems: [vocab]
              });
            }
          });
          
          // Create the final result object
          const inspectionResult = {
            theme: theme,
            objects: objects
          };
          
          setResult(inspectionResult);
          setProgress(100);
          setStatus('Inspection complete! Found ' + objects.length + ' objects.');
          
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('Error processing GLB:', err);
          setError('Error processing GLB: ' + errorMessage);
          setProgress(0);
        }
      },
      
      // onProgress callback
      (xhr) => {
        const loadingProgress = Math.min(40, Math.floor((xhr.loaded / xhr.total) * 40));
        setProgress(10 + loadingProgress);
        setStatus(`Loading GLB file: ${Math.floor((xhr.loaded / xhr.total) * 100)}%`);
      },
      
      // onError callback
      (err) => {
        console.error('Error loading GLB:', err);
        setError('Error loading GLB file: ' + (err instanceof Error ? err.message : 'Unknown error'));
        setProgress(0);
        setIsInspecting(false);
      }
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">GLB Inspector Tool</h1>
      
      <div className="mb-4">
        <label className="block mb-2">GLB Path:</label>
        <input 
          type="text" 
          value={glbPath} 
          onChange={(e) => setGlbPath(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={isInspecting && progress < 100}
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Theme Name:</label>
        <input 
          type="text" 
          value={themeName} 
          onChange={(e) => setThemeName(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={isInspecting && progress < 100}
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Theme Description:</label>
        <input 
          type="text" 
          value={themeDescription} 
          onChange={(e) => setThemeDescription(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={isInspecting && progress < 100}
        />
      </div>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={inspectGLBFile}
          disabled={isInspecting && progress < 100}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isInspecting && progress < 100 ? 'Inspecting...' : 'Inspect GLB'}
        </button>
        
        <button
          onClick={() => {
            if (result) {
              downloadInspectionResult(result);
              setStatus('JSON file downloaded. Ready to import to database.');
            }
          }}
          disabled={!result}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Download JSON for Database
        </button>
      </div>
      
      {isInspecting && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>
      )}
      
      {result && (
        <>
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <h3 className="font-bold mb-2">How to import this data to your database:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Download the JSON file using the button above</li>
              <li>Edit the file to add proper Vietnamese translations if needed</li>
              <li>Use the file with Prisma to seed your database</li>
            </ol>
            <p className="mt-2 text-xs">Note: This inspector extracts real data from your GLB file - no sample data is used.</p>
          </div>
          
          <h2 className="text-xl font-bold mb-2">Inspection Results (Found {result.objects.length} objects):</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
