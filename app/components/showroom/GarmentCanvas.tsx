"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

interface GarmentCanvasProps {
  color: string;
  roughness?: number;
  metalness?: number;
  wireframe?: boolean;
}

// Procedural 3D sculptural garment model evoking tailored high-fashion statement wear
function SculptedGarment({ color, roughness = 0.4, metalness = 0.15, wireframe = false }: GarmentCanvasProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Smooth subtle idle breathing rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  // Procedural tailored torso & drape silhouette
  const bodyGeometry = useMemo(() => {
    // Lathe geometry creates an elegant high-fashion mannequin / tailored garment silhouette
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, -1.8));
    points.push(new THREE.Vector2(0.9, -1.7));
    points.push(new THREE.Vector2(1.05, -1.3));
    points.push(new THREE.Vector2(1.15, -0.7));
    points.push(new THREE.Vector2(0.95, -0.1));
    points.push(new THREE.Vector2(0.85, 0.4));
    points.push(new THREE.Vector2(1.35, 1.1)); // Structured shoulder line
    points.push(new THREE.Vector2(1.2, 1.35));
    points.push(new THREE.Vector2(0.5, 1.45)); // High lapel / collar
    points.push(new THREE.Vector2(0.4, 1.7));
    points.push(new THREE.Vector2(0, 1.75));

    return new THREE.LatheGeometry(points, 48);
  }, []);

  return (
    <group ref={meshRef} position={[0, -0.1, 0]}>
      {/* Main Sculpted Garment Body */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          wireframe={wireframe}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Structured Tailored Lapel Overlay */}
      <mesh position={[0, 0.85, 0.42]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.1, 0.9, 0.12]} />
        <meshStandardMaterial
          color={color}
          roughness={Math.max(0.1, roughness - 0.1)}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* Floating Precision Centerline / Seam */}
      <mesh position={[0, 0.1, 0.98]}>
        <cylinderGeometry args={[0.015, 0.015, 2.2, 16]} />
        <meshStandardMaterial color="#0038FF" emissive="#0038FF" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

export default function GarmentCanvas({
  color,
  roughness,
  metalness,
  wireframe,
}: GarmentCanvasProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ position: [0, 0.4, 4.4], fov: 42 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow shadow-mapSize={1024} />
        <pointLight position={[-4, 2, -2]} intensity={0.8} color="#0038FF" />
        <pointLight position={[3, -2, 2]} intensity={0.6} color="#FFFFFF" />

        <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.3}>
          <SculptedGarment
            color={color}
            roughness={roughness}
            metalness={metalness}
            wireframe={wireframe}
          />
        </Float>

        <ContactShadows
          position={[0, -2.1, 0]}
          opacity={0.6}
          scale={7}
          blur={2.4}
          far={4}
          color="#000000"
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          dampingFactor={0.06}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>
    </div>
  );
}
