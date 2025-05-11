'use client';

import { useEffect, useState } from 'react';
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { HoverEffect } from "@/components/GallerCard";
import Link from 'next/link';
import { getAllCarModels, getImageUrl } from '@/lib/appwrite'
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Stage } from "@react-three/drei";
import { Loader2 } from "lucide-react";

interface CarModel {
  id: string;
  title: string;
  src: string;
  alt: string;
  description: string;
  customizeLink: string;
  viewLink: string;
  userId?: string;
  isCustom?: boolean;
  fileId: string;
  modelPath: string;
  bodyColor?: string;
  wheelColor?: string;
  wheelScale?: number;
}

const PLACEHOLDER_IMAGE = '/assets/image/placeholder-car.jpg'; // Make sure this exists or use any placeholder

function ModelViewer({ modelUrl, bodyColor = "#ffffff", wheelColor = "#000000", wheelScale = 1 }: { 
  modelUrl: string;
  bodyColor?: string;
  wheelColor?: string;
  wheelScale?: number;
}) {
  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    scene.traverse((node: any) => {
      if (node.isMesh && node.material) {
        const nodeName = node.name.toLowerCase();

        if (nodeName.includes("wheel") || nodeName.includes("tire")) {
          node.material.color.set(wheelColor);
          node.scale.set(wheelScale, wheelScale, wheelScale);
          const offsetY = (wheelScale - 1) * -0.1;
          node.position.y = offsetY;
        }

        if (nodeName.includes("body") || nodeName.includes("chassis") || (nodeName.includes("car") && !nodeName.includes("wheel"))) {
          node.material.color.set(bodyColor);
          node.material.metalness = 0.8;
          node.material.roughness = 0.2;
          node.material.needsUpdate = true;
        }
      }
    });
  }, [bodyColor, wheelColor, wheelScale, scene]);

  return (
    <primitive
      object={scene}
      scale={[2.5, 2.5, 2.5]}
      position={[0, 0, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

export default function GalleryPage() {
  const { user } = useUser();
  const [carData, setCarData] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);
  const [modelUrl, setModelUrl] = useState<string>('');
  const [isLoadingModel, setIsLoadingModel] = useState(false);

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const models = await getAllCarModels();
        
        const carModels = models.map(model => {
          let imageUrl = '';
          if (model.imageUrl) {
            imageUrl = getImageUrl(model.imageUrl);
          }
          return {
            id: model.$id,
            title: model.modelName,
            src: imageUrl || PLACEHOLDER_IMAGE,
            alt: model.modelName,
            description: `${model.companyName || ''} ${model.year || ''}`.trim(),
            customizeLink: `/customize/${model.slug}`,
            viewLink: `/view/${model.slug}`,
            userId: model.userId,
            isCustom: model.isCustom,
            fileId: model.fileId,
            modelPath: model.modelPath,
            bodyColor: model.bodyColor || "#ffffff",
            wheelColor: model.wheelColor || "#000000",
            wheelScale: model.wheelScale || 1
          };
        });

        // Show pre-uploaded models (userId === "owner") and user's own models
        const filteredModels = carModels.filter(model => {
          return model.userId === "owner" || model.userId === user?.id;
        });
        
        setCarData(filteredModels);
      } catch (error) {
        console.error('Error fetching car models:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, [user?.id]); // Re-fetch when user changes

  const handleView = async (model: CarModel) => {
    setSelectedModel(model);
    setIsLoadingModel(true);
    try {
      const fileId = model.modelPath.split('/').pop() || model.modelPath;
      const response = await fetch(`/api/models/${fileId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load model');
      }
      
      setModelUrl(data.url);
    } catch (error) {
      console.error('Error loading model:', error);
    } finally {
      setIsLoadingModel(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center shadow-md bg-white dark:bg-neutral-900 sticky top-0 z-50">
        <div className="text-2xl font-bold text-red-500">
          Auto<span className="text-black dark:text-white">Vista</span>
        </div>
        <div className="hidden md:flex gap-8">
          <Link href="/" className="text-neutral-700 dark:text-neutral-200 hover:text-red-500 transition">
            Home
          </Link>
          <Link href="/customize" className="text-neutral-700 dark:text-neutral-200 hover:text-red-500 transition">
            Customize
          </Link>
          <Link href="/upload" className="text-neutral-700 dark:text-neutral-200 hover:text-red-500 transition">
            Upload
          </Link>
        </div>
      </nav>
      {/* Gallery Section */}
      <section className="w-full px-4 py-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <TypewriterEffectSmooth
            words={[
              { text: "Explore", className: "text-black" },
              { text: "Cars", className: "text-red-500" }
            ]}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : carData.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No car models found. Upload some models to see them here!
          </div>
        ) : (
          <HoverEffect items={carData} onView={handleView} />
        )}
      </section>

      {/* View Dialog */}
      <Dialog open={!!selectedModel} onOpenChange={() => setSelectedModel(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <div className="w-full h-full">
            {isLoadingModel ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              </div>
            ) : modelUrl && selectedModel ? (
              <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
                <Stage environment="studio" intensity={0.5}>
                  <ModelViewer 
                    modelUrl={modelUrl}
                    bodyColor={selectedModel.bodyColor}
                    wheelColor={selectedModel.wheelColor}
                    wheelScale={selectedModel.wheelScale}
                  />
                </Stage>
                <OrbitControls 
                  enableZoom={true} 
                  enablePan={false} 
                  minPolarAngle={Math.PI / 4} 
                  maxPolarAngle={Math.PI / 2}
                  autoRotate
                  autoRotateSpeed={1}
                />
                <Environment preset="city" />
              </Canvas>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
