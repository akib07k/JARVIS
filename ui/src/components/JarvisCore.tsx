import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Orb = ({ isThinking }: { isThinking: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.y = t * 0.3;
    const s = 1 + Math.sin(t * 2.5) * 0.08;
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <group>
      {/* Outer Glow Sphere */}
      <Sphere args={[1.3, 64, 64]}>
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.1} wireframe />
      </Sphere>

      {/* Main Core */}
      <Float speed={3} rotationIntensity={0.8} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.85, 64, 64]} />
          <MeshDistortMaterial
            color={isThinking ? "#00F0FF" : "#00BFFF"}
            speed={isThinking ? 5 : 2.5}
            distort={0.5}
            radius={1}
            transparent
            opacity={0.9}
            metalness={0.9}
            roughness={0.1}
            emissive={isThinking ? "#00F0FF" : "#00BFFF"}
            emissiveIntensity={1.5}
          />
        </mesh>
      </Float>

      {/* Inner Wobble Core */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <MeshWobbleMaterial
          color="#ffffff"
          speed={4}
          factor={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

export const JarvisCore = ({ isThinking }: { isThinking: boolean }) => {
  return (
    <div className="w-64 h-64 mx-auto relative cursor-pointer">
      {/* Glow Backdrop */}
      <div className="absolute inset-0 bg-[#00E5FF]/20 rounded-full blur-[80px] animate-pulse" />
      
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00F0FF" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00BFFF" />
        <Orb isThinking={isThinking} />
      </Canvas>
    </div>
  );
};

