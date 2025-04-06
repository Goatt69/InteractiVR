'use client';

import Link from "next/link";
import ModelViewer from "../../components/ModelViewer";
import { Suspense } from "react";

export default function ModelViewerPage() {
  // You can replace this with your actual model path
  const modelPath = "/models/Space.glb";
  
  return (
    <div className="min-h-screen p-8 flex flex-col">
      <header className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">← Back to Home</Link>
        <h1 className="text-2xl font-bold mt-4">3D Model Viewer</h1>
      </header>
      
      <main className="flex-1">
        <div className="w-full rounded-lg overflow-hidden shadow-lg bg-black/5 dark:bg-white/5 p-4">
          <Suspense fallback={<div className="w-full h-[500px] flex items-center justify-center">Loading model...</div>}>
            <ModelViewer modelPath={modelPath} />
          </Suspense>
        </div>
        
        <div className="mt-8 p-6 bg-black/5 dark:bg-white/5 rounded-lg">
          <h2 className="text-xl font-bold mb-4">About This Model</h2>
          <p>
            This is a 3D model viewer that uses Three.js to render GLTF/GLB models.
            You can interact with the model using your mouse to rotate, pan, and zoom.
          </p>
        </div>
      </main>
    </div>
  );
}
