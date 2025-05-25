'use client';

import VRScene from "../../components/VRScene";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { themeService } from "@/services/theme.service";

// Create a client component that uses useSearchParams
function VRExperienceContent() {
  const searchParams = useSearchParams();
  const modelParam = searchParams.get('model') || "";
  const [modelPath, setModelPath] = useState<string>(modelParam);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if the model parameter is a theme ID (number)
    const themeId = parseInt(modelParam);
    
    if (!isNaN(themeId)) {
      // It's a theme ID, fetch the theme data
      setIsLoading(true);
      setError(null);
      
      themeService.getThemeById(themeId)
        .then(response => {
          if (response.success && response.data && response.data.sceneUrl) {
            // Use the sceneUrl from the theme data
            setModelPath(response.data.sceneUrl);
          } else {
            setError("Failed to load theme data: Theme has no scene URL");
          }
        })
        .catch(err => {
          console.error("Error fetching theme:", err);
          setError("Error loading theme: " + err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (modelParam) {
      // It's already a path, use it directly
      setModelPath(modelParam);
    } else {
      setError("No model path or theme ID provided");
    }
  }, [modelParam]);

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center bg-black text-white">Loading theme data...</div>;
  }

  if (error) {
    return <div className="w-full h-screen flex items-center justify-center bg-black text-white">Error: {error}</div>;
  }

  return <VRScene fullScreen={true} modelPath={modelPath} />;
}

export default function VRExperiencePage() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-black text-white">Loading VR experience...</div>}>
        <VRExperienceContent />
      </Suspense>
    </div>
  );
}
