"use client"

import { useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Stage } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Loader2 } from "lucide-react"
import ColorPicker from "@/components/color-picker"
import AccessorySelector from "@/components/accessory-selector"
import ModelUploader from "@/components/model-uploader"
import ThemeToggle from "@/components/theme-toggle"

// Define the car model with customizable properties
interface CarModel {
  bodyColor: string
  wheelColor: string
  color: string
  wheels: string
  headlights: string
  interiorColor: string
  zoom: number
  modelPath: string
}

// Car component that renders the 3D model
function Car({ bodyColor, wheelColor, modelPath }: CarModel) {
  const { scene } = useGLTF(modelPath || "/assets/3d/duck.glb");
  const model = scene.clone();

  model.traverse((node: any) => {
    if (node.isMesh && node.material) {
      if (node.name.toLowerCase().includes("wheel") || node.name.toLowerCase().includes("tire")) {
        node.material.color.setStyle(wheelColor);
      } else {
        node.material.color.setStyle(bodyColor);
      }
    }
  });

  return <primitive object={model} scale={[2.5, 2.5, 2.5]} position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} />;
}


export default function CarCustomizer() {
  // Default car configuration
  const [carConfig, setCarConfig] = useState<CarModel>({
    bodyColor: "#3b82f6", // blue
    color: "#3b82f6", // blue
    wheels: "standard",
    wheelColor: "#1e293b", // dark slate
    headlights: "standard",
    interiorColor: "#1e293b", // dark slate
    zoom: 2.5,
    modelPath: "/assets/3d/duck.glb",
  })

  // Track loading state for save operation
  const [isSaving, setIsSaving] = useState(false)

  // Handle color change
  const handleColorChange = (color: string) => {
    setCarConfig({ ...carConfig, color })
  }

  // Handle accessory change
  const handleAccessoryChange = (type: keyof CarModel, value: string) => {
    setCarConfig({ ...carConfig, [type]: value })
  }

  // Handle zoom change
  const handleZoomChange = (value: number[]) => {
    setCarConfig({ ...carConfig, zoom: value[0] })
  }

  // Handle model upload
  const handleModelUpload = (modelPath: string) => {
    setCarConfig({ ...carConfig, modelPath })
  }

  // Save configuration
  const saveConfiguration = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would save to a database or generate a shareable link
      const configString = JSON.stringify(carConfig)
      localStorage.setItem("savedCarConfig", configString)
      setIsSaving(false)
      alert("Configuration saved successfully!")
    }, 1500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* 3D Viewer */}
      <div className="lg:col-span-2 bg-muted/30 rounded-lg overflow-hidden shadow-sm h-[500px] lg:h-[700px] relative">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading 3D model...</span>
            </div>
          }
        >
          <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
            <Stage environment="studio" intensity={0.5}>
              <Car {...carConfig} />
            </Stage>
            <OrbitControls enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
            <Environment preset="city" />
          </Canvas>
        </Suspense>
      </div>

      {/* Customization Panel */}
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Customize Your Car</h2>

            <Tabs defaultValue="color">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="color">Color</TabsTrigger>
                <TabsTrigger value="accessories">Parts</TabsTrigger>
                <TabsTrigger value="model">Model</TabsTrigger>
                <TabsTrigger value="view">View</TabsTrigger>
              </TabsList>

              <TabsContent value="color" className="space-y-4">
                <ColorPicker
                  bodyColor={carConfig.bodyColor}
                  wheelColor={carConfig.wheelColor}
                  selectedColor={carConfig.color}
                  onBodyColorChange={(color) => setCarConfig((prev) => ({ ...prev, bodyColor: color }))}
                  onWheelColorChange={(color) => setCarConfig((prev) => ({ ...prev, wheelColor: color }))}
                />
              </TabsContent>

              <TabsContent value="accessories" className="space-y-4">
                <AccessorySelector
                  selectedWheels={carConfig.wheels}
                  selectedHeadlights={carConfig.headlights}
                  selectedInteriorColor={carConfig.interiorColor}
                  onChange={handleAccessoryChange}
                />
              </TabsContent>

              <TabsContent value="model" className="space-y-4">
                <ModelUploader onModelUpload={handleModelUpload} />
              </TabsContent>

              <TabsContent value="view" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="zoom">Zoom Level</Label>
                  <Slider
                    id="zoom"
                    min={1}
                    max={5}
                    step={0.1}
                    value={[carConfig.zoom]}
                    onValueChange={handleZoomChange}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" onClick={saveConfiguration} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Configuration"
          )}
        </Button>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Current Configuration</h3>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>
                Body Color: <span className="font-mono">{carConfig.bodyColor}</span>
              </p>
              <p>
                Wheels: <span className="capitalize">{carConfig.wheels}</span>
              </p>
              <p>
                Headlights: <span className="capitalize">{carConfig.headlights}</span>
              </p>
              <p>
                Interior: <span className="font-mono">{carConfig.interiorColor}</span>
              </p>
              <p>
                Model: <span className="font-mono truncate block">{carConfig.modelPath.split("/").pop()}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

