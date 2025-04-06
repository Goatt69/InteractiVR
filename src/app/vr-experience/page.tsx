'use client';

import Link from "next/link";
import VRScene from "../../components/VRScene";
import { Suspense } from "react";

export default function VRExperiencePage() {
  return (
    <div className="min-h-screen p-8 flex flex-col">
      <header className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">← Back to Home</Link>
        <h1 className="text-2xl font-bold mt-4">VR Experience</h1>
      </header>
      
      <main className="flex-1">
        <div className="w-full rounded-lg overflow-hidden shadow-lg bg-black/5 dark:bg-white/5 p-4">
          <Suspense fallback={<div className="w-full h-[500px] flex items-center justify-center">Loading VR experience...</div>}>
            <VRScene />
          </Suspense>
        </div>
        
        <div className="mt-8 p-6 bg-black/5 dark:bg-white/5 rounded-lg">
          <h2 className="text-xl font-bold mb-4">About This VR Experience</h2>
          <p className="mb-4">
            This is an interactive VR experience built with Three.js and WebXR. 
            Click the &#34;Enter VR&#34; button to experience it in virtual reality with a compatible headset.
          </p>
          <p>
            <strong>Instructions:</strong> Use your VR controllers to interact with objects in the virtual space.
            You can teleport around the environment and grab objects.
          </p>
        </div>
      </main>
    </div>
  );
}
