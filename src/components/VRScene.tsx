import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { useState } from 'react'

const store = createXRStore()

export default function VRScene() {
    const [red, setRed] = useState(false)

    return (
        <>
            <button
                onClick={() => store.enterVR()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4"
            >
                Enter VR
            </button>

            <Canvas className="h-[500px] w-full">
                <XR store={store}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[1, 5, 5]} intensity={1} />

                    <mesh
                        pointerEventsType={{ deny: 'grab' }}
                        onClick={() => setRed(!red)}
                        position={[0, 1, -1]}
                    >
                        <boxGeometry />
                        <meshBasicMaterial color={red ? 'red' : 'blue'} />
                    </mesh>

                    {/* Simple floor */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                        <planeGeometry args={[10, 10]} />
                        <meshStandardMaterial color="#444" />
                    </mesh>
                </XR>
            </Canvas>
        </>
    )
}
