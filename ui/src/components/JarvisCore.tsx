import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Orb = ({ isThinking }: { isThinking: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Rotation and subtle scale pulse
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.y = t * 0.3;
    const s = 1 + Math.sin(t * 2) * 0.05;
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <group>
      {/* Outer Glow Sphere */}
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.05} wireframe />
      </Sphere>

      {/* Main Core */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.8, 64, 64]} />
          <MeshDistortMaterial
            color={isThinking ? "#0891b2" : "#22d3ee"}
            speed={isThinking ? 4 : 2}
            distort={0.4}
            radius={1}
            transparent
            opacity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Inner Wobble Core */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <MeshWobbleMaterial
          color="#ffffff"
          speed={3}
          factor={0.6}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
};

export const JarvisCore = ({ isThinking }: { isThinking: boolean }) => {
  return (
    <div className="w-64 h-64 mx-auto relative cursor-pointer">
      {/* Glow Backdrop */}
      <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[60px] animate-pulse" />
      
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <Orb isThinking={isThinking} />
      </Canvas>
    </div>
  );
};
