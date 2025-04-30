"use client"

import React, { useState, useMemo, Suspense } from "react"
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
import ThemeToggle from "@/components/theme-toggle"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
interface GalleryItem {
  id: number;
  userId: string;
  modelPath: string;
  bodyColor: string;
  wheelColor: string;
  accessories: any[];
  shared: number;
  src: string;
  alt: string;
  carName: string;
}
import { useUser } from "@clerk/nextjs"
import { toast } from "@/components/ui/use-toast"

interface CarModel {
  bodyColor: string
  wheelColor: string
  wheels: string
  headlights: string
  interiorColor: string
  zoom: number
  modelPath: string
  modelName: string
  finish: "glossy" | "matte"
  wheelScale: number
}

const defaultModelPath = "/assets/3d/toyota_fortuner_2021.glb"

function Car({ bodyColor, wheelColor, modelPath, finish, wheelScale = 1 }: CarModel) {
  const { scene } = useGLTF(modelPath)

  useMemo(() => {
    scene.traverse((node: any) => {
      if (node.isMesh && node.material) {
        const nodeName = node.name.toLowerCase()

        // Update wheel material and transform
        if (nodeName.includes("wheel") || nodeName.includes("tire")) {
          node.material.color.set(wheelColor)
          node.scale.set(wheelScale, wheelScale, wheelScale)

          // Move wheels downward as they scale up to stay aligned with the ground
          const offsetY = (wheelScale - 1) * -0.1
          node.position.y = offsetY
        }

        // Update body color and finish
        if (
          nodeName.includes("body") ||
          nodeName.includes("chassis") ||
          (nodeName.includes("car") && !nodeName.includes("wheel"))
        ) {
          node.material.color.set(bodyColor)
          node.material.metalness = finish === "glossy" ? 0.8 : 0.1
          node.material.roughness = finish === "glossy" ? 0.2 : 0.7
          node.material.needsUpdate = true
        }
      }
    })
  }, [bodyColor, wheelColor, finish, wheelScale, scene])

  return (
    <primitive
      object={scene}
      scale={[2.5, 2.5, 2.5]}
      position={[0, 0, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  )
}

export default function CarCustomizer({ cars }: { cars: GalleryItem[] }) {
  const { user } = useUser()
  const [carConfig, setCarConfig] = useState<CarModel>({
    bodyColor: "#3b82f6",
    wheelColor: "#1e293b",
    wheels: "standard",
    headlights: "standard",
    interiorColor: "#1e293b",
    zoom: 2.5,
    modelPath: defaultModelPath,
    modelName: "toyota_fortuner_2021",
    finish: "glossy",
    wheelScale: 1,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleZoomChange = (value: number[]) => {
    setCarConfig((prev) => ({ ...prev, zoom: value[0] }))
  }

  // const handleModelChange = (newModelPath: string) => {
  //   setCarConfig((prev) => ({ ...prev, modelPath: newModelPath }))
  // }
  const handleModelChange = (newModelPath: string) => {
    const selectedModel = cars.find((m) => m.modelPath === newModelPath)
    setCarConfig((prev) => ({
      ...prev,
      modelPath: newModelPath,
      modelName: selectedModel?.name || "Unknown",
    }))
  }


  const saveConfiguration = async () => {
    setIsSaving(true)
    try {
      const payload = {
        ...carConfig,
        userEmail: user?.emailAddresses[0].emailAddress,
        userName: user?.fullName,
      }

      const res = await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      alert("Configuration saved to database successfully!")
    } catch (error: any) {
      alert("Error saving configuration: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const saveCar = async () => {
    setIsSaving(true)
    try {
      const payload = {
        userId: user?.id,
        modelPath: carConfig.modelPath,
        bodyColor: carConfig.bodyColor,
        wheelColor: carConfig.wheelColor,
        accessories: [],
        shared: true,
      }

      await fetch("/api/saveCar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      toast({ title: "Car saved to gallery!" })
    } catch (error: any) {
      toast({ title: "Error saving car: " + error.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }
  const selectedModelName = useMemo(() => {
    return (
      cars.find((m) => m.modelPath === carConfig.modelPath)?.alt ||
      "Unknown"
    )
  }, [carConfig.modelPath])
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 bg-muted/30 rounded-lg overflow-hidden shadow-sm h-[500px] lg:h-[700px] relative">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />}>
          <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
            <Stage environment="studio" intensity={0.5}>
              <Car {...carConfig} />
            </Stage>
            <OrbitControls enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
            <Environment preset="city" />
          </Canvas>
        </Suspense>
      </div>

      <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 scrollbar-hide">
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
                  onBodyColorChange={(color) => setCarConfig((prev) => ({ ...prev, bodyColor: color }))}
                  onWheelColorChange={(color) => setCarConfig((prev) => ({ ...prev, wheelColor: color }))}
                />

                <div className="space-y-2">
                  <Label htmlFor="finish">Finish</Label>
                  <Select
                    value={carConfig.finish}
                    onValueChange={(value) =>
                      setCarConfig((prev) => ({ ...prev, finish: value as "glossy" | "matte" }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Finish" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="glossy">Glossy</SelectItem>
                      <SelectItem value="matte">Matte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="accessories" className="space-y-4">
                <AccessorySelector
                  selectedWheels={carConfig.wheels}
                  selectedHeadlights={carConfig.headlights}
                  selectedInteriorColor={carConfig.interiorColor}
                  onChange={(type, value) => setCarConfig((prev) => ({ ...prev, [type]: value }))}
                />

                <div className="space-y-2">
                  <Label htmlFor="wheel-scale">Wheel Size</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      id="wheel-scale"
                      min={0.5}
                      max={1.2}
                      step={0.1}
                      value={[carConfig.wheelScale || 1]}
                      onValueChange={(value) => setCarConfig((prev) => ({ ...prev, wheelScale: value[0] }))}
                    />
                    <span className="text-sm font-mono w-10">{carConfig.wheelScale.toFixed(1)}x</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="model" className="space-y-4">
                <Label htmlFor="car-model">Choose a Model</Label>
                <Select onValueChange={handleModelChange} value={carConfig.modelPath}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {cars.map((model) => (
                        <SelectItem key={model.carName} value={model.modelPath}>
                        {model.carName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

        <Button onClick={saveCar} className="w-full" size="lg">Save Car</Button>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Current Configuration</h3>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p className="flex items-center gap-2">
                Body Color:
                <span
                  className="inline-block w-5 h-5 rounded"
                  style={{ backgroundColor: carConfig.bodyColor }}
                ></span>
                <span className="font-mono">{carConfig.wheelColor}</span>
              </p>
              <p className="flex items-center gap-2">
                Wheel Color:
                <span
                  className="inline-block w-5 h-5 rounded"
                  style={{ backgroundColor: carConfig.wheelColor }}
                ></span>
                <span className="font-mono">{carConfig.wheelColor}</span>
              </p>

              <p>
                Model: <span className="font-mono">{selectedModelName}</span>
              </p>
              <p>
                Finish: <span className="font-mono">{carConfig.finish}</span>
              </p>
              <p>
                Wheel Size: <span className="font-mono">{carConfig.wheelScale.toFixed(1)}x</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
