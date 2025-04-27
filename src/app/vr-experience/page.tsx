'use client';

import VRScene from "../../components/VRScene";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function VRExperiencePage() {
  const searchParams = useSearchParams();
  const modelPath = searchParams.get('model') || "/models/Space.glb";

  return (
    <div className="w-full h-screen overflow-hidden">
      <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-black text-white">Loading VR experience...</div>}>
        <VRScene fullScreen={true} modelPath={modelPath} />
      </Suspense>
    </div>
  );
}
