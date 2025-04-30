"use client";

import React, { useEffect, Suspense, useState, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, Stage } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import * as THREE from 'three';

interface GalleryItem {
  id: number;
  userId: string;
  modelPath: string;
  bodyColor: string;
  wheelColor: string;
  accessories: any[];
  shared: number;
  src: string;
}


function Car({ scene }: { scene: THREE.Object3D }) {
  useEffect(() => {
    return () => {
      scene.traverse((node: any) => {
        if (node.isMesh) {
          node.geometry.dispose();
          if (node.material.map) node.material.map.dispose();
          if (node.material.lightMap) node.material.lightMap.dispose();
          if (node.material.bumpMap) node.material.bumpMap.dispose();
          if (node.material.normalMap) node.material.normalMap.dispose();
          if (node.material.specularMap) node.material.specularMap.dispose();
          if (node.material.envMap) node.material.envMap.dispose();
          node.material.dispose();
        }
      });
    };
  }, [scene]);

  return <primitive object={scene} scale={[2.5, 2.5, 2.5]} position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} />;
}

const calculateStates = (allItems: GalleryItem[]) => {
  const states: { startIndex: number; endIndex: number }[] = [];
  for (let i = 0; i < allItems.length; i += 6) {
    states.push({
      startIndex: i,
      endIndex: Math.min(i + 6, allItems.length),
    });
  }
  return states;
};

export function HoverEffect({ allItems }: { allItems: GalleryItem[] }) {
  const states = calculateStates(allItems);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);

  const currentstate = states[currentStateIndex];

  const handlePrev = () => {
    setCurrentStateIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStateIndex((prev) => Math.min(states.length - 1, prev + 1));
  };
  
  const startIndex = currentstate?.startIndex;
  const endIndex = currentstate?.endIndex;

  const items = allItems.slice(startIndex, endIndex);

  return (
    <div className="relative ">
      <div className="flex flex-wrap gap-8 justify-center">
        {items.map((item, index) => {
          const realIndex = allItems.indexOf(item)
          return <CardContainer key={item.id} className="inter-var w-full">
            <CardBody className="relative dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1]  h-auto rounded-xl border">
              <CardItem               
                className="text-xl font-bold text-neutral-600 dark:text-white flex items-center justify-center p-4"
              >             

                  <div className="relative w-full h-[250px]">
                    <Suspense
                      fallback={<div className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Loading...</div>}
                      className="flex items-center justify-center"
                    >
                    {realIndex >= startIndex && realIndex < endIndex ? (                 
                          <Canvas key={`canvas-${item.id}`} shadows camera={{ position: [0, 0, 10], fov: 50 }} className="w-full h-full" >
                            <Stage environment="city" intensity={0.5}>
                             <Car scene={useLoader(GLTFLoader, item.modelPath).scene} />
                             </Stage>
                            <OrbitControls enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
                            <Environment preset="city" />
                          </Canvas>
                      ) : null}
                    </Suspense>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <p className="text-sm font-medium text-white">{item.alt}</p>


                    </div>
                  </div>

              </CardItem>
            </CardBody>
          </CardContainer>
        })}

      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        {currentStateIndex > 0 && (
          <button
            onClick={handlePrev}
            className="bg-black/50 hover:bg-black/70 p-4 rounded-r-full text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        {currentStateIndex < states.length -1 && (
          <button
            onClick={handleNext}
            className="bg-black/50 hover:bg-black/70 p-4 rounded-l-full text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
        </div>
      </div>
    </div>

  );
}


