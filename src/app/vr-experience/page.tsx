'use client';

import VRScene from "../../components/VRScene";
import { Suspense } from "react";

export default function VRExperiencePage() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-black text-white">Loading VR experience...</div>}>
        <VRScene fullScreen={true} />
      </Suspense>
    </div>
  );
}
