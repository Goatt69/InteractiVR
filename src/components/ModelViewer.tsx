import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  Stage,
  Center
} from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { gl } = useThree();
  
  useEffect(() => {
    // In newer Three.js versions, we use ColorManagement instead of outputEncoding
    THREE.ColorManagement.enabled = true;
    
    // Make sure all materials are properly configured
    scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        // Enable shadows
        node.castShadow = true;
        node.receiveShadow = true;
        
        // Handle materials
        if (node.material) {
          // If material is an array, process each material
          if (Array.isArray(node.material)) {
            node.material.forEach(mat => {
              // Set material properties that help with texture appearance
              if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
              if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
              mat.needsUpdate = true;
            });
          } 
          // Handle single material
          else {
            if (node.material.map) node.material.map.colorSpace = THREE.SRGBColorSpace;
            if (node.material.emissiveMap) node.material.emissiveMap.colorSpace = THREE.SRGBColorSpace;
            node.material.needsUpdate = true;
          }
        }
      }
    });
  }, [scene, gl]);

  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  );
}

export default function ModelViewer({ modelPath }: { modelPath: string }) {
  return (
    <div className="w-full h-[500px]">
      <Canvas 
        shadows
        dpr={[1, 2]} // Responsive pixel ratio
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: true,
          outputColorSpace: THREE.SRGBColorSpace // Use this instead of outputEncoding
        }}
      >
        <color attach="background" args={['#f5f5f5']} />
        
        <Suspense fallback={null}>
          {/* Use a more neutral environment for better texture visibility */}
          <Stage
            environment="warehouse"
            intensity={0.5}
            castShadow={true}
            shadows={{ type: 'contact', opacity: 0.5, blur: 2 }}
            adjustCamera={true}
          >
            <Model url={modelPath} />
          </Stage>
          
          {/* Add environment lighting for better reflections */}
          <Environment preset="warehouse" background={false} />
        </Suspense>
        
        <OrbitControls 
          autoRotate={false}
          enableZoom={true}
          enablePan={true}
          minDistance={2}
          maxDistance={10}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
