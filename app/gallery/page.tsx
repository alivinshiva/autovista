import { HoverEffect } from '@/components/GallerCard'
import db from '@/lib/db'
import Link from 'next/link'
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
const getGalleryData = (): GalleryItem[] => {
  const sharedCars: any[] = db.prepare('SELECT * FROM Cars WHERE shared = 1').all()
  return sharedCars.map((item: any) => ({
    ...item, src: `/assets/image/${item.modelPath.split('.')[0]}.jpg`, modelPath: item.modelPath, alt: item.carName,
  }));
}
export default async function Page() { const items: GalleryItem[] = getGalleryData(); return (<main className="min-h-screen flex flex-col"> <header className="border-b p-4"> <div className="container mx-auto flex justify-between items-center"> <h1 className="text-2xl font-bold">AutoVista Customizer</h1> <nav> <ul className="flex space-x-4"> <li> <Link href="/" className="hover:text-primary"> Home </Link> </li> <li> <Link href="/customize" className="hover:text-primary"> Customize </Link> </li> <li> <Link href="#" className="hover:text-primary"> About </Link> </li> </ul> </nav> </div> </header> <div className="flex-grow container mx-auto p-4"> <HoverEffect allItems={items} /> </div> <footer className="border-t p-4"></footer> </main>)}
