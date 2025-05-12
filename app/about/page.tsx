"use client";

import { Car, Palette, Cog, Upload, Sun, ChevronRight } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About AutoVista</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Purpose</h2>
        <p className="text-lg text-muted-foreground">
          AutoVista is a 3D car customization platform designed to allow users to visualize and personalize their dream cars in an interactive environment. Our goal is to provide a seamless
          and engaging experience for car enthusiasts and individuals looking to customize their vehicles. We aim to make car personalization accessible and fun for everyone.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="grid md:grid-cols-2 gap-6 text-lg text-muted-foreground">
          <li className="flex items-start space-x-3">
            <Car className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <strong className="font-semibold">Interactive 3D Viewer:</strong> Explore every angle of your car with our interactive 3D model viewer powered by Three.js.
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <Palette className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <strong className="font-semibold">Color Customization:</strong> Choose from a wide range of colors or create your own custom shade for the perfect look.
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <Cog className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <strong className="font-semibold">Accessory Customization:</strong> Personalize wheels, headlights, and interior colors to match your style preferences.
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <Upload className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <strong className="font-semibold">Upload Your Models:</strong> Import your own 3D models created in Blender or other 3D software for customization.
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <Sun className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <strong className="font-semibold">Light & Dark Mode:</strong> Enjoy a comfortable viewing experience with support for both light and dark themes.
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <ChevronRight className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <strong className="font-semibold">Save & Share:</strong> Save your customizations and share them with friends or download for future reference.
            </div>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
        <p className="text-lg text-muted-foreground">
          AutoVista is built using modern web technologies including Next.js, React, Tailwind CSS for styling, and Three.js for the interactive 3D car viewer. The application is deployed on Vercel. We utilize MongoDB for data storage and Appwrite for authentication and file uploads.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <p className="text-lg text-muted-foreground mb-4">
          AutoVista is brought to you by a dedicated team of developers:
        </p>
        <ul className="list-disc list-inside text-lg text-muted-foreground">
          <li><strong className="text-primary">Shivam Kumar</strong></li>
          <li><strong className="text-primary">Aakash Kashyap</strong></li>
          <li><strong className="text-primary">Prateek Jyoti Nayak</strong></li>
          <li><strong className="text-primary">Pratyush Surya Panda</strong></li>
        </ul>
        <p className="text-lg text-muted-foreground mt-4">
          We are passionate about creating innovative tools for car enthusiasts and are constantly working to improve the platform.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;