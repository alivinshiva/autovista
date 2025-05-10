"use client"

import { useState, useMemo, Suspense } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@clerk/nextjs"

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

interface UploadProgress {
  name: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const carModels = [
  { name: "Tata Safari", path: "/assets/3d/2021_tata_safari.glb", slug: "2021_tata_safari" },
  { name: "Maruti Suzuki Baleno", path: "/assets/3d/2022_maruti_suzuki_baleno.glb", slug: "2022_maruti_suzuki_baleno" },
  { name: "Hyundai Creta", path: "/assets/3d/2023_hyundai_creta.glb", slug: "2023_hyundai_creta" },
  { name: "Audi", path: "/assets/3d/audi.glb", slug: "audi" },
  { name: "BMW M4 CSL 2023", path: "/assets/3d/bmw_m4_csl_2023.glb", slug: "bmw_m4_csl_2023" },
  { name: "Fortuner", path: "/assets/3d/fortuner.glb", slug: "fortuner" },
  { name: "Fortuner 2", path: "/assets/3d/fortuner2.glb", slug: "fortuner2" },
  { name: "Toyota GR Supra", path: "/assets/3d/toyota_gr_supra.glb", slug: "toyota_gr_supra" }
]

function Car({ bodyColor, wheelColor, modelPath, finish, wheelScale }: CarModel) {
  const { scene } = useGLTF(modelPath)

  useMemo(() => {
    scene.traverse((node: any) => {
      if (node.isMesh && node.material) {
        const nodeName = node.name.toLowerCase()

        if (nodeName.includes("wheel") || nodeName.includes("tire")) {
          node.material.color.set(wheelColor)
          node.scale.set(wheelScale, wheelScale, wheelScale)
          const offsetY = (wheelScale - 1) * -0.1
          node.position.y = offsetY
        }

        if (nodeName.includes("body") || nodeName.includes("chassis") || (nodeName.includes("car") && !nodeName.includes("wheel"))) {
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

export default function CarCustomizer({ slug }: { slug: string }) {
  const { user } = useUser()
  const defaultModel = carModels.find((m) => m.slug === slug) || carModels[0]

  const [carConfig, setCarConfig] = useState<CarModel>({
    bodyColor: "#2c2d3c",
    wheelColor: "#1e293b",
    wheels: "standard",
    headlights: "standard",
    interiorColor: "#1e293b",
    zoom: 2.5,
    modelPath: defaultModel.path,
    modelName: defaultModel.name,
    finish: "glossy",
    wheelScale: 1,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])

  const handleZoomChange = (value: number[]) => {
    setCarConfig((prev) => ({ ...prev, zoom: value[0] }))
  }

  const handleModelChange = (newModelPath: string) => {
    const selectedModel = carModels.find((m) => m.path === newModelPath)
    if (selectedModel) {
      setCarConfig((prev) => ({
        ...prev,
        modelPath: selectedModel.path,
        modelName: selectedModel.name,
      }))
    }
  }

  const saveConfiguration = async () => {
    setIsSaving(true)
    try {
      const payload = {
        userId: user?.id,
        userEmail: user?.emailAddresses[0]?.emailAddress,
        modelName: carConfig.modelName,
        modelPath: carConfig.modelPath,
        bodyColor: carConfig.bodyColor,
        wheelColor: carConfig.wheelColor,
        wheelScale: carConfig.wheelScale,
        finish: carConfig.finish,
        wheels: carConfig.wheels,
        headlights: carConfig.headlights,
        interiorColor: carConfig.interiorColor
      }

      const response = await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || "Failed to save configuration")
      }

      alert("Configuration saved successfully!")
    } catch (error: any) {
      console.error("Error saving configuration:", error)
      alert("Error saving configuration: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

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
            <OrbitControls enableZoom={true} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
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
                    {carModels.map((model) => (
                      <SelectItem key={model.path} value={model.path}>
                        {model.name}
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

                <div className="space-y-2">
                  <Label>Developer Tools</Label>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={async () => {
                      try {
                        // Initialize progress for all models
                        setUploadProgress(carModels.map(model => ({
                          name: model.name,
                          status: 'pending',
                          progress: 0
                        })))

                        const response = await fetch('/api/upload-all-models', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        })
                        const data = await response.json()
                        
                        if (data.success) {
                          // Update progress with results
                          setUploadProgress(data.results.map((result: any) => ({
                            name: result.name,
                            status: result.status === 'success' ? 'success' : 'error',
                            progress: result.status === 'success' ? 100 : 0,
                            error: result.error
                          })))
                        } else {
                          throw new Error(data.error || 'Failed to upload models')
                        }
                      } catch (error: any) {
                        console.error('Error uploading models:', error)
                        alert('Error uploading models: ' + error.message)
                      }
                    }}
                  >
                    Upload All Models to MongoDB
                  </Button>

                  {uploadProgress.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {uploadProgress.map((progress) => (
                        <div key={progress.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{progress.name}</span>
                            <span className={progress.status === 'error' ? 'text-red-500' : 'text-green-500'}>
                              {progress.status === 'success' ? '✓' : progress.status === 'error' ? '✗' : '...'}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                progress.status === 'success' 
                                  ? 'bg-green-500' 
                                  : progress.status === 'error' 
                                  ? 'bg-red-500' 
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${progress.progress}%` }}
                            />
                          </div>
                          {progress.error && (
                            <p className="text-xs text-red-500">{progress.error}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
      </div>
    </div>
  )
}

