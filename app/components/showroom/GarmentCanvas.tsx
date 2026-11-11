"use client";

import { Component, useMemo, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface GarmentCanvasProps {
  color: string;
  roughness?: number;
  metalness?: number;
  wireframe?: boolean;
  angle: number;
}

const unavailable = (
  <p role="status" className="flex h-full items-center justify-center px-5 text-center text-sm">
    3D materials are unavailable in this browser.
  </p>
);

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? unavailable : this.props.children;
  }
}

function SculptedGarment({
  color,
  roughness = 0.4,
  metalness = 0.15,
  wireframe = false,
  angle,
}: GarmentCanvasProps) {
  const geometry = useMemo(() => {
    const silhouette = new THREE.Shape();
    silhouette.moveTo(-0.45, 1.2);
    silhouette.quadraticCurveTo(0, 0.72, 0.45, 1.2);
    silhouette.lineTo(0.98, 1.03);
    silhouette.lineTo(1.64, 0.53);
    silhouette.lineTo(1.26, -0.08);
    silhouette.lineTo(0.86, 0.12);
    silhouette.lineTo(0.83, -1.26);
    silhouette.quadraticCurveTo(0, -1.35, -0.83, -1.26);
    silhouette.lineTo(-0.86, 0.12);
    silhouette.lineTo(-1.26, -0.08);
    silhouette.lineTo(-1.64, 0.53);
    silhouette.lineTo(-0.98, 1.03);
    silhouette.closePath();

    const sample = new THREE.ExtrudeGeometry(silhouette, {
      depth: 0.26,
      bevelSize: 0.09,
      bevelThickness: 0.12,
      bevelSegments: 4,
    });
    return sample.center();
  }, []);

  return (
    <mesh geometry={geometry} rotation={[0, angle, 0]}>
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} wireframe={wireframe} />
    </mesh>
  );
}

export default function GarmentCanvas({
  color,
  roughness,
  metalness,
  wireframe,
  angle,
}: GarmentCanvasProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <CanvasBoundary>
        <Canvas
          frameloop="demand"
          fallback={unavailable}
          camera={{ position: [0.8, 0.4, 6.2], fov: 42 }}
          className="w-full h-full"
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} />
          <pointLight position={[-4, 2, -2]} intensity={0.8} color="#5548ff" />
          <pointLight position={[3, -2, 2]} intensity={0.6} color="#FFFFFF" />

          <SculptedGarment
            color={color}
            roughness={roughness}
            metalness={metalness}
            wireframe={wireframe}
            angle={angle}
          />

          <OrbitControls
            enableDamping={false}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}
