'use client';

import { useEffect, useState } from 'react';
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { HoverEffect } from "@/components/GallerCard";
import Link from 'next/link';

export default function GalleryPage() {
  const carData = [
    {
      id: "tata-safari-2021",
      title: "Tata Safari 2021",
      src: "/assets/3d/2021_tata_safari.glb",
      image: "/assets/image/tata-safari.jpg",
      alt: "Tata Safari 2021",
      description: "Explore the rugged Tata Safari 2021 with its premium features and powerful performance.",
      customizeLink: "/customize/2021_tata_safari",
      viewLink: "/view/tata-safari-2021",
    },
    {
      id: "maruti-baleno-2022",
      title: "Maruti Suzuki Baleno 2022",
      src: "/assets/3d/2022_maruti_suzuki_baleno.glb",
      image: "/assets/image/maruti-baleno.jpg",
      alt: "Maruti Suzuki Baleno 2022",
      description: "Stylish and efficient hatchback with modern features and excellent fuel economy.",
      customizeLink: "/customize/2022_maruti_suzuki_baleno",
      viewLink: "/view/maruti-baleno-2022",
    },
    {
      id: "hyundai-creta-2023",
      title: "Hyundai Creta 2023",
      src: "/assets/3d/2023_hyundai_creta.glb",
      image: "/assets/image/hyundai-creta.jpg",
      alt: "Hyundai Creta 2023",
      description: "Modern SUV with cutting-edge technology and premium comfort features.",
      customizeLink: "/customize/2023_hyundai_creta",
      viewLink: "/view/hyundai-creta-2023",
    },
    {
      id: "audi",
      title: "Audi",
      src: "/assets/3d/audi.glb",
      image: "/assets/image/audi.jpg",
      alt: "Audi",
      description: "Luxury sedan with exceptional performance and sophisticated design.",
      customizeLink: "/customize/audi",
      viewLink: "/view/audi",
    },
    {
      id: "bmw-m4-csl-2023",
      title: "BMW M4 CSL 2023",
      src: "/assets/3d/bmw_m4_csl_2023.glb",
      image: "/assets/image/bmw-m4.jpg",
      alt: "BMW M4 CSL 2023",
      description: "High-performance sports car with track-focused engineering and premium features.",
      customizeLink: "/customize/bmw_m4_csl_2023",
      viewLink: "/view/bmw-m4-csl-2023",
    },
    {
      id: "fortuner",
      title: "Toyota Fortuner",
      src: "/assets/3d/fortuner.glb",
      image: "/assets/image/fortuner.jpg",
      alt: "Toyota Fortuner",
      description: "Rugged SUV with powerful performance and versatile capabilities.",
      customizeLink: "/customize/fortuner",
      viewLink: "/view/fortuner",
    },
    {
      id: "toyota-gr-supra",
      title: "Toyota GR Supra",
      src: "/assets/3d/toyota_gr_supra.glb",
      image: "/assets/image/toyota-supra.jpg",
      alt: "Toyota GR Supra",
      description: "Iconic sports car with legendary performance and modern technology.",
      customizeLink: "/customize/toyota_gr_supra",
      viewLink: "/view/toyota-gr-supra",
    }
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center shadow-md bg-white dark:bg-neutral-900 sticky top-0 z-50">
        <div className="text-2xl font-bold text-red-500">
          Auto<span className="text-black dark:text-white">Visa</span>
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

      {/* Hero Section */}
      <section id="upload" className="w-full px-4 py-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <TypewriterEffectSmooth
            words={[
              { text: "Explore", className: "text-black" },
              { text: "Cars", className: "text-red-500" }
            ]}
          />
        </div>

        <HoverEffect items={carData} />
      </section>
    </>
  );
}
