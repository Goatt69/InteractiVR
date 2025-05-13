'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { XR, createXRStore, useXR } from '@react-three/xr'
import { useState, Suspense, ReactNode, useRef, useEffect } from 'react'
import { useGLTF, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Mesh, Object3D, Vector3, Group } from 'three'
import ObjectInfoCard from './ObjectInfoCard'

import solarSystemObjects, { SpaceObject } from '../app/data/solarSystem'

// Create the XR store once at the top level
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

// Movement controls using WASD keys
function MovementControls() {
    const { camera } = useThree()
    const keysPressed = useRef({
        w: false,
        a: false,
        s: false,
        d: false,
        shift: false
    })
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'w') keysPressed.current.w = true
            if (e.key.toLowerCase() === 'a') keysPressed.current.a = true
            if (e.key.toLowerCase() === 's') keysPressed.current.s = true
            if (e.key.toLowerCase() === 'd') keysPressed.current.d = true
            if (e.key === 'Shift') keysPressed.current.shift = true
        }
        
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'w') keysPressed.current.w = false
            if (e.key.toLowerCase() === 'a') keysPressed.current.a = false
            if (e.key.toLowerCase() === 's') keysPressed.current.s = false
            if (e.key.toLowerCase() === 'd') keysPressed.current.d = false
            if (e.key === 'Shift') keysPressed.current.shift = false
        }
        
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])
    
    useFrame((_, delta) => {
        // Calculate movement speed (faster with shift)
        const speed = keysPressed.current.shift ? 10 : 5
        const moveDistance = speed * delta
        
        // Get the camera's forward, right and up vectors
        const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
        const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
        
        // Remove any vertical component for forward/backward movement
        forward.y = 0
        forward.normalize()
        
        // Move forward/backward
        if (keysPressed.current.w) {
            camera.position.addScaledVector(forward, moveDistance)
        }
        if (keysPressed.current.s) {
            camera.position.addScaledVector(forward, -moveDistance)
        }
        
        // Move left/right
        if (keysPressed.current.a) {
            camera.position.addScaledVector(right, -moveDistance)
        }
        if (keysPressed.current.d) {
            camera.position.addScaledVector(right, moveDistance)
        }
    })
    
    return null
}

function SolarSystemContent({ modelPath }: { modelPath: string }) {
    const { nodes } = useGLTF(modelPath)
    const [hoveredObject, setHoveredObject] = useState<null | string>(null)
    const [showInfo, setShowInfo] = useState(false)
    const [selectedObjectData, setSelectedObjectData] = useState<SpaceObject | null>(null)
    const { session } = useXR()
    const planetsRef = useRef<Group>(null)
    const { camera } = useThree()
    const [cameraPosition, setCameraPosition] = useState<Vector3 | null>(null)

    // Update camera position when camera changes
    useEffect(() => {
        setCameraPosition(camera.position.clone());
    }, [camera.position]);

    // Simplified function to find a space object by its identifier
    const findSpaceObject = (name: string): SpaceObject | null => {
        if (!Array.isArray(solarSystemObjects)) {
            return null;
        }

        // Remove any suffix from node name
        const cleanName = name.replace(/[_\d]+$/, '');
        
        // Search for object with case-insensitive matching
        return solarSystemObjects.find(obj => 
            obj.objectIdentifier?.toLowerCase() === name.toLowerCase() || 
            obj.objectIdentifier?.toLowerCase() === cleanName.toLowerCase() ||
            obj.name?.toLowerCase() === name.toLowerCase() ||
            obj.name?.toLowerCase() === cleanName.toLowerCase()
        ) || null;
    }

    // Create temporary object data if not found
    const createTempSpaceObject = (name: string): SpaceObject => {
        return {
            id: Date.now(),
            name: name,
            objectIdentifier: name,
            vocabularyItems: [
                { id: 0, englishWord: 'Object', vietnameseTranslation: 'This is a space object.', pronunciation: '', examples: [] },
                { id: 0, englishWord: 'Info', vietnameseTranslation: 'No detailed information available for this object.', pronunciation: '', examples: [] }
            ],
            interactable: true,
            themeId: 0
        };
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
        const planet = findSpaceObject(planetName);
        if (planet) {
            setHoveredObject(planetName);
            setSelectedObjectData(planet);
            setShowInfo(true);
            setCameraPosition(camera.position.clone());
        }
    }

    // Create 3D objects from the model
    const renderSolarSystemObjects = () => {
        const objects: ReactNode[] = []
        
        if (!nodes) {
            return objects;
        }
        
        // Loop through all the nodes in the GLTF model
        Object.entries(nodes).forEach(([nodeName, node]: [string, Object3D]) => {
            // Render mesh nodes only
            if ((node as Object3D).type === 'Mesh') {
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
                        pointerEvents="auto"
                        onPointerOver={(e) => {
                            e.stopPropagation()
                            setHoveredObject(nodeName)
                            document.body.style.cursor = 'pointer'
                        }}
                        onPointerOut={() => {
                            setHoveredObject(null)
                            document.body.style.cursor = 'default'
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            
                            // Find object in data
                            const spaceObject = findSpaceObject(nodeName) || createTempSpaceObject(nodeName)
                            
                            // Update selected object data
                            setSelectedObjectData(spaceObject)
                            
                            // Set camera position
                            setCameraPosition(camera.position.clone())
                            
                            // Show info
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
            
            <PerspectiveCamera makeDefault position={[0, 5, 10]} />
            
            <MovementControls />
            
            <group ref={planetsRef}>
                {renderSolarSystemObjects()}
            </group>
            
            {selectedObjectData && showInfo && cameraPosition && (
                <ObjectInfoCard
                    name={selectedObjectData.name}
                    id={selectedObjectData.id}
                    objectIdentifier={selectedObjectData.objectIdentifier}
                    vocabularyItems={selectedObjectData.vocabularyItems || []}
                    onClose={() => {
                        setShowInfo(false)
                        setSelectedObjectData(null)
                    }}
                    position={[
                        cameraPosition.x,
                        cameraPosition.y,
                        cameraPosition.z - 2
                    ]}
                />
            )}
            
            <Environment 
                files="/environments/Sky.hdr" 
                background 
            />
            {!session && <OrbitControls makeDefault enableZoom={true} enablePan={true} />}
        </>
    )
}

interface VRSceneProps {
    fullScreen?: boolean,
    modelPath?: string
}

export default function VRScene({ fullScreen = false, modelPath = '/models/Space.glb' }: VRSceneProps) {
    useGLTF.preload(modelPath)
    
    const [hasError, setHasError] = useState(false)
    
    return (
        <div className={`relative ${fullScreen ? 'h-screen w-full' : 'h-[80vh] w-full'}`}>
            <button
                onClick={() => store.enterVR()}
                className={`
                    bg-gradient-to-r from-blue-600 to-blue-400 text-white px-5 py-3 rounded-lg shadow-lg 
                    hover:from-blue-700 hover:to-blue-500 transition-transform transform hover:scale-105
                    ${fullScreen ? 'absolute top-6 right-6 z-10' : 'mb-4'}
                `}
            >
                Enter VR
            </button>

            <Canvas 
                className="w-full h-full"
                shadows
                gl={{ localClippingEnabled: true }}
            >
                <XR store={store}>
                    <Suspense fallback={
                        <mesh>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color="hotpink" />
                        </mesh>
                    }>
                        <SolarSystemContent modelPath={modelPath} />
                    </Suspense>
                </XR>
            </Canvas>

            {fullScreen && (
                <div className="absolute bottom-6 left-6 z-10 bg-black/60 text-white p-4 rounded-lg shadow-lg">
                    <p className="text-sm">Press 1-9 keys to focus on different planets</p>
                    <p className="text-sm">Move with WASD | Orbit with mouse | Zoom with scroll</p>
                </div>
            )}
        </div>
    )
}