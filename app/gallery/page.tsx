'use client';

import { useEffect, useState } from 'react';
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { HoverEffect } from "@/components/GallerCard";
import Link from 'next/link';
import { getAllCarModels, getImageUrl } from '@/lib/appwrite'

interface CarModel {
  id: string;
  title: string;
  src: string;
  alt: string;
  description: string;
  customizeLink: string;
  viewLink: string;
}

const PLACEHOLDER_IMAGE = '/assets/image/placeholder-car.jpg'; // Make sure this exists or use any placeholder

export default function GalleryPage() {
  const [carData, setCarData] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      try {
        const models = await getAllCarModels();
        const carModels = models.map(model => {
          let imageUrl = '';
          if (model.imageUrl) {
            imageUrl = getImageUrl(model.imageUrl);
            console.log('Model:', model.modelName, 'imageUrl:', model.imageUrl, '->', imageUrl);
          } else {
            console.warn('Model missing imageUrl:', model);
          }
          return {
            id: model.slug,
            title: model.modelName,
            src: imageUrl || PLACEHOLDER_IMAGE,
            alt: model.modelName,
            description: `${model.companyName || ''} ${model.year || ''}`.trim(),
            customizeLink: `/customize/${model.slug}`,
            viewLink: `/view/${model.slug}`,
          };
        });
        setCarData(carModels);
      } catch (error) {
        console.error('Error fetching car models:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

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
          <HoverEffect items={carData} />
        )}
      </section>
    </>
  );
}
