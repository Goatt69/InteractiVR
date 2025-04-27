'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { XR, createXRStore, useXR } from '@react-three/xr'
import { useState, Suspense, ReactNode, useRef, useEffect } from 'react'
import { useGLTF, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Mesh, Object3D, Vector3, Group } from 'three'
import ObjectInfoCard from './ObjectInfoCard'

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
    const [hoveredObject, setHoveredObject] = useState<null | any>(null)
    const [showInfo, setShowInfo] = useState(false)
    const { session } = useXR()
    const planetsRef = useRef<Group>(null)

    // Create 3D objects from the model
    const renderSolarSystemObjects = () => {
        const objects: ReactNode[] = []
        
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
                        onPointerOver={(e) => {
                            e.stopPropagation()
                            setHoveredObject(nodeName)
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
            
            {hoveredObject && showInfo && (
                <ObjectInfoCard
                    name={hoveredObject}
                    id={0}
                    objectIdentifier={hoveredObject}
                    vocabularyItems={[]}
                    onClose={() => setShowInfo(false)}
                    position={[0, 0.5, -1]}
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
    
    const store = createXRStore()

    const [hasError, setHasError] = useState(false)

    if (hasError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black text-white">
                <p>VR session error occurred. Please try again.</p>
            </div>
        )
    }

    const ErrorBoundaryWrapper = ({ children }: { children: ReactNode }) => {
        try {
            return <>{children}</>
        } catch (error) {
            console.error('Error in XR session:', error)
            setHasError(true)
            return null
        }
    }
    
    return (
        <div className={`relative ${fullScreen ? 'h-screen w-full' : 'h-[80vh] w-full'}`}>
            {!fullScreen && (
                <button
                    onClick={() => store.enterVR()}
                    className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-5 py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-500 transition-transform transform hover:scale-105 mb-4"
                >
                    Enter VR
                </button>
            )}

            {fullScreen && (
                <button
                    onClick={() => store.enterVR()}
                    className="absolute top-6 right-6 z-10 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-5 py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-500 transition-transform transform hover:scale-105"
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
                        <ErrorBoundaryWrapper>
                            <SolarSystemContent modelPath={modelPath} />
                        </ErrorBoundaryWrapper>
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
