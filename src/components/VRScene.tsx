'use client';

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore, useXR } from '@react-three/xr'
import { useState, Suspense, ReactNode, useRef, useEffect } from 'react'
import { useGLTF, OrbitControls, PerspectiveCamera, Environment, useFont } from '@react-three/drei';
import { Mesh, Object3D, Group } from 'three'
import ObjectInfoCard from './ObjectInfoCard'
import { IObject } from '@/types/object.types';
import { IVocabulary } from '@/types/vocabulary.types';
import { objectService } from '@/services/object.service';
import { vocabularyService } from '@/services/vocabulary.service';

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

interface SolarSystemContentProps {
    modelPath: string
}

function SolarSystemContent({ modelPath }: SolarSystemContentProps) {
    const { nodes } = useGLTF(modelPath)
    const [hoveredObject, setHoveredObject] = useState<IObject | null>(null)
    const [showInfo, setShowInfo] = useState(false)
    const { session } = useXR()
    const planetsRef = useRef<Group>(null)
    const [objects, setObjects] = useState<IObject[]>([])
    const [vocabularyMap, setVocabularyMap] = useState<Record<number, IVocabulary[]>>({})
    const [loading, setLoading] = useState(true)
    const [loadingVocabulary, setLoadingVocabulary] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [vocabularyError, setVocabularyError] = useState<string | null>(null)

    // Fetch objects from API
    useEffect(() => {
        const fetchObjects = async () => {
            try {
                setLoading(true)
                const response = await objectService.getObjects()
                if (response.success && response.data) {
                    setObjects(response.data)
                    // After fetching objects, fetch vocabulary for each object
                    await fetchAllVocabulary(response.data)
                } else {
                    setError('Failed to fetch objects')
                }
            } catch (error) {
                console.error('Error fetching objects:', error)
                setError('Error loading objects')
            } finally {
                setLoading(false)
            }
        }

        fetchObjects()
    }, [])

    // Function to fetch vocabulary for all objects
    const fetchAllVocabulary = async (objectsList: IObject[]) => {
        try {
            setLoadingVocabulary(true)
            const vocabMap: Record<number, IVocabulary[]> = {}

            // Create an array of promises to fetch vocabulary for each object
            const fetchPromises = objectsList.map(async (obj) => {
                try {
                    const response = await vocabularyService.getVocabularyByObjectId(obj.id)
                    if (response.success && response.data) {
                        vocabMap[obj.id] = response.data

                        // Parse examples if they're stored as JSON string
                        response.data.forEach(vocab => {
                            if (typeof vocab.examples === 'string') {
                                try {
                                    vocab.examples = JSON.parse(vocab.examples)
                                } catch (e) {
                                    // If not valid JSON, keep as is
                                    console.warn(`Could not parse examples for vocab ID ${vocab.id}`)
                                }
                            }
                        })
                    }
                } catch (error) {
                    console.error(`Error fetching vocabulary for object ${obj.id}:`, error)
                }
            })

            // Wait for all vocabulary fetches to complete
            await Promise.all(fetchPromises)

            // Update the vocabulary map
            setVocabularyMap(vocabMap)
        } catch (error) {
            console.error('Error fetching vocabulary:', error)
            setVocabularyError('Error loading vocabulary')
        } finally {
            setLoadingVocabulary(false)
        }
    }

    // Function to find a space object by its identifier
    const findSpaceObject = (name: string): IObject | undefined => {
        return objects.find(obj =>
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
        } else {
            console.warn(`Planet ${planetName} not found in loaded objects`)
        }
    }

    // Create 3D objects from the model
    const renderSolarSystemObjects = () => {
        const objects: ReactNode[] = []

        if (!nodes) {
            return objects;
        }

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
                        pointerEvents="auto"
                        onPointerOver={(e) => {
                            e.stopPropagation()
                            setHoveredObject(objectData)
                            document.body.style.cursor = 'pointer'
                        }}
                        onPointerOut={() => {
                            setHoveredObject(null)
                            document.body.style.cursor = 'default'
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
                <group position={[0, 0.5, -1]}>
                    <Suspense fallback={null}>
                        <ObjectInfoCard
                            id={hoveredObject.id}
                            name={hoveredObject.name}
                            objectIdentifier={hoveredObject.objectIdentifier}
                            vocabularyItems={vocabularyMap[hoveredObject.id] || []}
                            onClose={() => setShowInfo(false)}
                            position={[0, 0, 0]}
                            isLoading={loadingVocabulary}
                        />
                    </Suspense>
                </group>
            )}

            <Environment
                files="/environments/Sky.hdr"
                background
            />
            {!session && <OrbitControls makeDefault enableZoom={true} enablePan={true} />}
        </>
    );
}

interface VRSceneProps {
    fullScreen?: boolean
    modelPath: string
}

export default function VRScene({ fullScreen = false, modelPath }: VRSceneProps) {
    // Preload the models
    useGLTF.preload(modelPath)
    useFont.preload('/fonts/Quicksand-msdf.json')
    useFont.preload('/fonts/TIMES.TTF-msdf.json')
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
                    <Suspense fallback={null}>
                            <SolarSystemContent modelPath={modelPath}/>
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