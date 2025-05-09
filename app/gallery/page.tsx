// 'use client';

// import { useEffect, useState, Suspense } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import { Card, CardContent } from '@/components/ui/card'; // adjust if needed
// import { Gallery } from "@/components/gallery"
// import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
// import Link from 'next/link';


// function GLBModel({ url }: { url: string }) {
//   const { scene } = useGLTF(url);
//   return <primitive object={scene} scale={0.5} />;
// }

// export default function GalleryPage() {
//   const [files, setFiles] = useState<string[]>([]);

//   useEffect(() => {
//     fetch('/api/getGlbFiles')
//       .then(res => res.json())
//       .then(data => setFiles(data.files))
//       .catch(err => console.error('Error fetching GLB files:', err));
//   }, []);

//   const carData = [
//     {
//       title: "Audi Red",
//       src: "/assets/image/amjith-s-8G4hNKdu60M-unsplash.jpg",
//       description: "Customized Audi in red color",
//     },
//     {
//       title: "BMW Matte",
//       src: "/assets/image/anastase-maragos-Lrfuy93_hAc-unsplash.jpg",
//       description: "Matte black BMW",
//       link: "/car/bmw",
//     },
//     {
//       title: "Lambo Green",
//       src: "/assets/image/karsten-winegeart-afDsNrec8gI-unsplash.jpg",
//       description: "Neon green Lamborghini",
//       link: "/car/lambo",
//     },
//     {
//       title: "Tesla",
//       src: "/assets/image/tesla-fans-schweiz-7_OQMgoGzDw-unsplash.jpg",
//     },
//     {
//       title: "Nissan GT-R",
//       src: "/assets/image/stevosdisposable-6DnSGv4VZlo-unsplash.jpg",
//     },
//     {
//       title: "Nissan GT-R",
//       src: "/assets/image/live-car-p635p3cj7x0qkf44.jpg",
//     },
//   ];

//   return (
   
//     <>

//       <nav className="w-full px-6 py-4 flex justify-between items-center shadow-md bg-white dark:bg-neutral-900 sticky top-0 z-50">
//         <div className="text-2xl font-bold text-red-500">
//           Auto<span className="text-black dark:text-white">Visa</span>
//         </div>

//         <div className="hidden md:flex gap-8">
//           <Link href="/" className="text-neutral-700 dark:text-neutral-200 hover:text-red-500 transition">
//             Home
//           </Link>
//           <Link href="/customize" className="text-neutral-700 dark:text-neutral-200 hover:text-red-500 transition">
//             Customize
//           </Link>
//           <Link href="/upload" className="text-neutral-700 dark:text-neutral-200 hover:text-red-500 transition">
//             Upload
//           </Link>
//         </div>

//         {/* Mobile menu icon - (optional, if you want later) */}
//       </nav>

//       {/* hero section */}
//       <section id="upload" className="w-full px-4 py-10">
//         <div className="flex flex-col items-center justify-center mb-8">
//           {/* <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
//             The road to freedom starts from here
//           </p> */}
//           <TypewriterEffectSmooth words={[{ text: "Explore", className: "text-black" }, { text: "Cars", className: "text-red-500" }]} />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {carData.map((car, index) => (
//             <Gallery key={index} car={car} />
//           ))}
//         </div>
//       </section>
//     </>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { HoverEffect } from "@/components/GallerCard"; // You will update this too
import Link from 'next/link';

export default function GalleryPage() {
  const carData = [
    {
      id: "tata-safari-2021",
      title: "Tata Safari 2021",
      src: "/assets/3d/2021_tata_safari.glb",
      alt: "Tata Safari 2021",
      description: "Explore the rugged Tata Safari 2021.",
      customizeLink: "/customize/2021_tata_safari",
      viewLink: "/view/123", // Dummy, you will replace dynamically later
    },
    {
      id: "maruti-baleno-2022",
      title: "Maruti Suzuki Baleno 2022",
      src: "/assets/3d/2022_maruti_suzuki_baleno.glb",
      alt: "Maruti Suzuki Baleno 2022",
      description: "Stylish and efficient hatchback.",
      customizeLink: "/customize/2022_maruti_suzuki_baleno",
      viewLink: "/view/124",
    },
    // ...repeat for other cars
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
