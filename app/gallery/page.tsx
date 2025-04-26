'use client';

import { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Card, CardContent } from '@/components/ui/card'; // adjust if needed
import { Gallery } from "@/components/gallery"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Link from 'next/link';


function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.5} />;
}

export default function GalleryPage() {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/getGlbFiles')
      .then(res => res.json())
      .then(data => setFiles(data.files))
      .catch(err => console.error('Error fetching GLB files:', err));
  }, []);

  const carData = [
    {
      title: "Audi Red",
      src: "/assets/image/amjith-s-8G4hNKdu60M-unsplash.jpg",
      description: "Customized Audi in red color",
    },
    {
      title: "BMW Matte",
      src: "/assets/image/anastase-maragos-Lrfuy93_hAc-unsplash.jpg",
      description: "Matte black BMW",
      link: "/car/bmw",
    },
    {
      title: "Lambo Green",
      src: "/assets/image/karsten-winegeart-afDsNrec8gI-unsplash.jpg",
      description: "Neon green Lamborghini",
      link: "/car/lambo",
    },
    {
      title: "Tesla",
      src: "/assets/image/tesla-fans-schweiz-7_OQMgoGzDw-unsplash.jpg",
    },
    {
      title: "Nissan GT-R",
      src: "/assets/image/stevosdisposable-6DnSGv4VZlo-unsplash.jpg",
    },
    {
      title: "Nissan GT-R",
      src: "/assets/image/live-car-p635p3cj7x0qkf44.jpg",
    },
  ];

  return (
    // <div className="p-6">
    //   <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">🚗 Car Gallery</h1>

    //   {files.length === 0 ? (
    //     <p className="text-center text-gray-500">No 3D cars found.</p>
    //   ) : (
    //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    //       {files.map(file => (
    //         <Card key={file} className="shadow-lg hover:shadow-xl transition">
    //           <CardContent className="h-48 bg-gray-100 rounded-md shadow-lg">
    //             <Canvas camera={{ position: [0, 0, 3] }}>
    //               <ambientLight intensity={0.5} />
    //               <directionalLight position={[0, 0, 5]} />
    //               <Suspense fallback={null}>
    //                 <GLBModel url={`/assets/3d/${file}`} />
    //                 <OrbitControls enableZoom={true} enableRotate={true} enablePan={false} />
    //               </Suspense>
    //             </Canvas>
    //           </CardContent>
    //           <div className="p-4 text-center">
    //             <p className="font-medium text-gray-700">{file.replace('.glb', '').replace(/[-_]/g, ' ')}</p>
    //           </div>
    //         </Card>
    //       ))}
    //     </div>
    //   )}
    // </div>
    <>

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

        {/* Mobile menu icon - (optional, if you want later) */}
      </nav>

      {/* hero section */}
      <section id="upload" className="w-full px-4 py-10">
        <div className="flex flex-col items-center justify-center mb-8">
          {/* <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
            The road to freedom starts from here
          </p> */}
          <TypewriterEffectSmooth words={[{ text: "Explore", className: "text-black" }, { text: "Cars", className: "text-red-500" }]} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {carData.map((car, index) => (
            <Gallery key={index} car={car} />
          ))}
        </div>
      </section>
    </>
  );
}
