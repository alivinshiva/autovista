"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Car, Palette, Cog, Upload, Moon, Sun } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { PresentationControls, Environment, useGLTF } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

function CarModel() {
  const { scene } = useGLTF("/assets/3d/duck.glb")
  return <primitive object={scene} scale={[3, 3, 3]} position={[0, -2, 0]} rotation={[0, Math.PI / 4, 0]} />
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: any
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="text-primary w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AutoVisa</span>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-foreground/80 hover:text-foreground">
                Features
              </a>
              <a href="#upload" className="text-foreground/80 hover:text-foreground">
                Upload Model
              </a>
              <Link href="/customize" className="text-foreground/80 hover:text-foreground">
                Customize
              </Link>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative bg-gradient-to-br from-white via-gray-100 to-white dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Canvas className="w-full h-full !bg-transparent" shadows camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <PresentationControls
                  global
                  rotation={[0, 0, 0]}
                  polar={[-Math.PI / 4, Math.PI / 4]}
                  azimuth={[-Math.PI / 4, Math.PI / 4]}
                  config={{ mass: 2, tension: 400 }}
                  snap={{ mass: 4, tension: 400 }}
                >
                  <CarModel />
                </PresentationControls>
                <Environment preset="city" />
              </Canvas>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg text-white">Customize Your Dream Car in 3D</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg drop-shadow-md">

              AutoVisa lets you visualize and personalize your car with our interactive 3D customization platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Button asChild size="lg" className="group relative z-10">
                <Link href="/customize">
                  Start Customizing
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="relative z-10">
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Background decorations */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Powerful Customization Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Everything you need to visualize and personalize your dream car
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Car}
              title="Interactive 3D Viewer"
              description="Explore every angle of your car with our interactive 3D model viewer powered by Three.js."
              delay={0.2}
            />
            <FeatureCard
              icon={Palette}
              title="Color Customization"
              description="Choose from a wide range of colors or create your own custom shade for the perfect look."
              delay={0.3}
            />
            <FeatureCard
              icon={Cog}
              title="Accessory Customization"
              description="Personalize wheels, headlights, and interior colors to match your style preferences."
              delay={0.4}
            />
            <FeatureCard
              icon={Upload}
              title="Upload Your Models"
              description="Import your own 3D models created in Blender or other 3D software for customization."
              delay={0.5}
            />
            <FeatureCard
              icon={Sun}
              title="Light & Dark Mode"
              description="Enjoy a comfortable viewing experience with support for both light and dark themes."
              delay={0.6}
            />
            <FeatureCard
              icon={ChevronRight}
              title="Save & Share"
              description="Save your customizations and share them with friends or download for future reference."
              delay={0.7}
            />
          </div>
        </div>
      </section>

      {/* Upload Model Section */}
      <section id="upload" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upload Your Own 3D Models</h2>
              <p className="text-xl text-muted-foreground">
                Have a 3D model you created? Upload it to AutoVisa and start customizing right away.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card border rounded-xl p-8 shadow-sm"
            >
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Drag and drop your 3D model here</h3>
                <p className="text-muted-foreground mb-6">Supports GLB, GLTF formats (max 50MB)</p>
                <Button>Select File</Button>
              </div>
              <div className="mt-6 text-sm text-muted-foreground">
                <p>
                  Your models are processed securely and privately. We support models created in Blender, Maya, 3DS Max,
                  and other 3D modeling software.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Customize Your Dream Car?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
          >
            Jump into our 3D customization platform and bring your vision to life.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Button asChild size="lg" variant="secondary" className="group">
              <Link href="/customize">
                Start Customizing Now
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">AutoVisa</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Contact Us 
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">© 2025 AutoVisa. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

