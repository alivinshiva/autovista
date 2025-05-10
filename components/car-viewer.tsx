'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stage } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';

interface CarViewerProps {
  modelPath: string;
  bodyColor: string;
  wheelColor: string;
  finish: "glossy" | "matte";
  wheelScale: number;
}

function Car({ modelPath, bodyColor, wheelColor, finish, wheelScale }: CarViewerProps) {
  const [model, setModel] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const response = await fetch(modelPath);
        if (!response.ok) {
          throw new Error(`Failed to load model: ${response.statusText}`);
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const { scene } = await useGLTF(url);
        
        // Apply materials to the model
        scene.traverse((child: any) => {
          if (child.isMesh) {
            if (child.name.toLowerCase().includes('body')) {
              child.material.color.set(bodyColor);
              child.material.metalness = finish === "glossy" ? 0.8 : 0.2;
              child.material.roughness = finish === "glossy" ? 0.2 : 0.8;
            } else if (child.name.toLowerCase().includes('wheel')) {
              child.material.color.set(wheelColor);
              child.scale.set(wheelScale, wheelScale, wheelScale);
            }
          }
        });

        setModel(scene);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Error loading model:', err);
        setError(err instanceof Error ? err.message : 'Failed to load model');
      }
    };

    loadModel();
  }, [modelPath, bodyColor, wheelColor, finish, wheelScale]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!model) {
    return <div>Loading model...</div>;
  }

  return <primitive object={model} />;
}

export default function CarViewer(props: CarViewerProps) {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
          <Stage environment="studio" intensity={0.5}>
            <Car {...props} />
          </Stage>
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2} 
          />
          <Environment preset="city" />
        </Canvas>
      </Suspense>
    </div>
  );
} 