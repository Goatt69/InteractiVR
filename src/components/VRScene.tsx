'use client';

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore, useXR } from '@react-three/xr'
import { useState, Suspense, ReactNode, useRef, useEffect } from 'react'
import { useGLTF, OrbitControls, PerspectiveCamera, Environment, useFont } from '@react-three/drei';
import { Mesh, Object3D, Group } from 'three'
import solarSystemObjects, { SpaceObject } from '@/app/data/solarSystem'
import ObjectInfoCard from './ObjectInfoCard'

const store = createXRStore()

// Custom hooks for keyboard interaction
const useKeyPressEvent = (targetKey: string, onKeyPress: () => void) => {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === targetKey.toLowerCase() && !event.repeat) {
                onKeyPress()
            }
        }
        
        window.addEventListener('keypress', handleKeyPress)
        return () => {
            window.removeEventListener('keypress', handleKeyPress)
        }
    }, [targetKey, onKeyPress])
}

function SolarSystemContent() {
    const { nodes } = useGLTF('/models/Space.glb')
    const [hoveredObject, setHoveredObject] = useState<SpaceObject | null>(null)
    const [showInfo, setShowInfo] = useState(false)
    const { session } = useXR()
    const planetsRef = useRef<Group>(null)
    
    // Function to find a space object by its identifier
    const findSpaceObject = (name: string): SpaceObject | undefined => {
        return solarSystemObjects.find(obj => 
            obj.objectIdentifier.toLowerCase() === name.toLowerCase())
    }

    // Keyboard shortcuts to focus on planets
    useKeyPressEvent('1', () => focusOnPlanet('Sun'))
    useKeyPressEvent('2', () => focusOnPlanet('Mercury'))
    useKeyPressEvent('3', () => focusOnPlanet('Venus'))
    useKeyPressEvent('4', () => focusOnPlanet('Earth'))
    useKeyPressEvent('5', () => focusOnPlanet('Mars'))
    useKeyPressEvent('6', () => focusOnPlanet('Jupiter'))
    useKeyPressEvent('7', () => focusOnPlanet('Saturn'))
    useKeyPressEvent('8', () => focusOnPlanet('Uranus'))
    useKeyPressEvent('9', () => focusOnPlanet('Neptune'))
    
    const focusOnPlanet = (planetName: string) => {
        const planet = findSpaceObject(planetName)
        if (planet) {
            setHoveredObject(planet)
            setShowInfo(true)
        }
    }

    // Create 3D objects from the model
    const renderSolarSystemObjects = () => {
        const objects: ReactNode[] = []
        
        // Loop through all the nodes in the GLTF model
        Object.entries(nodes).forEach(([nodeName, node]) => {
            // Try to find corresponding object data
            const objectData = findSpaceObject(nodeName)
            
            if (objectData && (node as Object3D).type === 'Mesh') {
                const mesh = node as unknown as Mesh
                
                objects.push(
                    <mesh
                        key={nodeName}
                        name={nodeName}
                        geometry={mesh.geometry}
                        material={mesh.material}
                        position={mesh.position}
                        rotation={mesh.rotation}
                        scale={mesh.scale}
                        castShadow
                        receiveShadow
                        onPointerOver={(e) => {
                            e.stopPropagation()
                            setHoveredObject(objectData)
                        }}
                        onPointerOut={() => {
                            setHoveredObject(null)
                            setShowInfo(false)
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowInfo(true)
                        }}
                    />
                )
            }
        })
        
        return objects
    }

    return (
        <>
            
            {/* Add ambient and directional light */}
            <ambientLight intensity={0.3} />
            <directionalLight 
                position={[10, 10, 5]} 
                intensity={1} 
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
                shadow-bias={-0.00001}
            />

            {/* Camera setup */}
            <PerspectiveCamera makeDefault position={[0, 5, 10]} />

            {/* Render the solar system objects */}
            <group ref={planetsRef}>
                {renderSolarSystemObjects()}
            </group>

            {/* Show info card when hovering and clicked */}
            {hoveredObject && showInfo && (
                <ObjectInfoCard
                    name={hoveredObject.name}
                    id={hoveredObject.id}
                    objectIdentifier={hoveredObject.objectIdentifier}
                    vocabularyItems={hoveredObject.vocabularyItems}
                    onClose={() => setShowInfo(false)}
                    position={[0, 0.5, -1]}
                />
            )}
            <Environment 
                files="/environments/Sky.hdr" 
                background 
            />
            {/* Controls for camera - only show when not in VR */}
            {!session && <OrbitControls makeDefault enableZoom={true} enablePan={true} />}
        </>
    )
}

interface VRSceneProps {
    fullScreen?: boolean
}

export default function VRScene({ fullScreen = false }: VRSceneProps) {
    // Preload the models and fonts
    useGLTF.preload('/models/Space.glb')
    useFont.preload('/fonts/Quicksand-msdf.json')
    useFont.preload('/fonts/TIMES.TTF-msdf.json')
    
    return (
        <div className={`relative ${fullScreen ? 'h-screen w-full' : 'h-[80vh] w-full'}`}>
            {!fullScreen && (
                <button
                    onClick={() => store.enterVR()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4"
                >
                    Enter VR
                </button>
            )}

            {fullScreen && (
                <button
                    onClick={() => store.enterVR()}
                    className="absolute top-4 right-4 z-10 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Enter VR
                </button>
            )}

            <Canvas 
                className="w-full h-full"
                shadows
                gl={{ localClippingEnabled: true }}
            >
                <XR store={store}>
                    <Suspense fallback={null}>
                        <SolarSystemContent />
                    </Suspense>
                </XR>
            </Canvas>

            {fullScreen && (
                <div className="absolute bottom-4 left-4 z-10 bg-black/50 text-white p-3 rounded-md">
                    <p className="text-sm">Press 1-9 keys to focus on different planets</p>
                    <p className="text-sm">Move with WASD | Orbit with mouse | Zoom with scroll</p>
                </div>
            )}
        </div>
    )
}