import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useSettingsStore } from '../../store/settingsStore'

const Board3D: React.FC = () => {
    const { boardTheme } = useSettingsStore()

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
            <Canvas shadows camera={{ position: [0, 10, 10], fov: 45 }}>
                <color attach="background" args={['#1a1a1a']} />

                <Suspense fallback={null}>
                    {/* Lighting */}
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
                    <Environment preset="city" />

                    {/* Board Placeholder */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                        <planeGeometry args={[10, 10]} />
                        <meshStandardMaterial color={boardTheme.lightSquare || "#f0d9b5"} />
                    </mesh>

                    {/* Ground Reflections */}
                    <ContactShadows resolution={1024} scale={100} blur={4} opacity={0.25} far={10} />
                </Suspense>

                <OrbitControls
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 2.2}
                    minDistance={5}
                    maxDistance={20}
                />
            </Canvas>
        </div>
    )
}

export default Board3D
