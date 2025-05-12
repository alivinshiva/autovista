"use client"

import React, { useState, useMemo, Suspense, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Stage, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Loader2, Trash2 } from "lucide-react"
import ColorPicker from "@/components/color-picker"
import AccessorySelector from "@/components/accessory-selector"
import ThemeToggle from "@/components/theme-toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { getAllCarModels, deleteCarModelAndFiles } from '@/lib/appwrite'
import { Models } from 'appwrite'
import { useRouter } from "next/navigation"
import ModelUpload from "./model-upload"

interface CarModel extends Models.Document {
  modelName: string
  modelPath: string
  slug: string
  imageUrl: string
  fileId: string
  companyName: string
  year?: string
  userId?: string
  isCustom?: boolean
}

interface CarConfig {
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
  imageUrl: string
  fileId: string
}

interface CarProps {
  bodyColor: string;
  wheelColor: string;
  modelPath: string;
  finish: "glossy" | "matte";
  wheelScale: number;
}

interface ModelViewerProps {
  modelUrl: string;
  bodyColor: string;
  wheelColor: string;
  finish: "glossy" | "matte";
  wheelScale: number;
}
const defaultModelPath = "/assets/3d/toyota_fortuner_2021.glb"

function Car({ bodyColor, wheelColor, modelPath, finish, wheelScale }: CarProps) {
  const [modelUrl, setModelUrl] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadModel = async () => {
      if (!modelPath) {
        setError('No model path provided');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true)
        setError('')
        // Assume modelPath is the fileId for custom models, or the path for defaults
        const fileId = modelPath.includes('/') ? modelPath.split('/').pop() : modelPath;
        
        // Check if it's a default model path (starts with /assets)
        if (modelPath.startsWith('/assets')) {
            setModelUrl(modelPath); // Use the path directly for default models
        } else {
            // Fetch URL for custom models from the API
            const response = await fetch(`/api/models/${fileId}`)
            const data = await response.json()
            
            if (!response.ok) {
              throw new Error(data.error || 'Failed to load model URL')
            }
            setModelUrl(data.url)
        }
      } catch (error) {
        console.error('Error loading model URL:', error)
        setError(error instanceof Error ? error.message : 'Failed to load model')
      } finally {
        setIsLoading(false)
      }
    }

    loadModel();
  }, [modelPath])

  if (isLoading) {
    return <Html center><div>Loading model...</div></Html>
  }

  if (error) {
    return <Html center><div className="text-red-500">Error: {error}</div></Html>
  }

  if (!modelUrl) {
    return <Html center><div>No model URL available</div></Html>
  }

  return <ModelViewer 
    modelUrl={modelUrl} 
    bodyColor={bodyColor} 
    wheelColor={wheelColor} 
    finish={finish} 
    wheelScale={wheelScale} 
  />
}

function ModelViewer({ modelUrl, bodyColor, wheelColor, finish, wheelScale }: ModelViewerProps): JSX.Element {
  const { scene } = useGLTF(modelUrl)

  useEffect(() => {
    if (!scene) return;
    scene.traverse((node: any) => {
      if (node.isMesh && node.material) {
        const nodeName = node.name.toLowerCase();
        const materials = Array.isArray(node.material) ? node.material : [node.material];

        // Update accent material (rims and chrome accents)
        if (nodeName.includes("rim") || nodeName.includes("chrome")) {
          materials.forEach(material => {
            if (material.isMaterial) { 
              material.color.set(wheelColor);
              material.needsUpdate = true;
            }
          });
        }

        // Apply wheel scale and position adjustments (applies to the whole wheel assembly)
        if (nodeName.includes("wheel") || nodeName.includes("tire") || nodeName.includes("rim")) {
             // Only scale if wheelScale is different from 1 to avoid unnecessary calculations
             if (wheelScale !== 1) {
                 node.scale.set(wheelScale, wheelScale, wheelScale);
                 // Basic offset adjustment - might need refinement depending on model origin
                 const offsetY = (wheelScale - 1) * -0.1; // Adjust multiplier as needed
                 node.position.y += offsetY; // Apply offset relative to current position
             }
        }

        // Update body color and finish
        if (
          nodeName.includes("body") ||
          nodeName.includes("chassis") ||
          nodeName.includes("paint") || // Common naming convention
          (nodeName.includes("car") && 
           !nodeName.includes("wheel") && 
           !nodeName.includes("tire") && 
           !nodeName.includes("rim") && 
           !nodeName.includes("chrome") &&
           !nodeName.includes("glass") && // Don't color windows
           !nodeName.includes("light") // Don't color lights
          )
        ) {
          materials.forEach(material => {
            if (material.isMaterial) {
              material.color.set(bodyColor);
              material.metalness = finish === "glossy" ? 0.8 : 0.1;
              material.roughness = finish === "glossy" ? 0.2 : 0.7;
              material.needsUpdate = true;
            }
          });
        }
      }
    });
  }, [bodyColor, wheelColor, finish, wheelScale, scene]);

  // Memoize the scene to prevent unnecessary re-renders
  const memoizedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={memoizedScene}
      scale={[2.5, 2.5, 2.5]}
      position={[0, -1, 0]} // Adjusted position for better viewing
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

interface CarCustomizerProps {
  slug?: string;
}

export default function CarCustomizer({ slug }: CarCustomizerProps) {
  const { user } = useUser()
  const router = useRouter()
  const [models, setModels] = useState<CarModel[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [carConfig, setCarConfig] = useState<CarConfig>({
    bodyColor: "#ffffff",
    wheelColor: "#000000",
    wheels: "default",
    headlights: "default",
    interiorColor: "#1e293b",
    zoom: 2.5,
    modelPath: "",
    modelName: "",
    finish: "glossy",
    wheelScale: 1,
    imageUrl: "",
    fileId: "",
  })

  const fetchModels = async () => {
    try {
      setLoading(true);
      const carModels = await getAllCarModels();
      
      const typedModels = carModels.map(model => ({
        ...model,
        modelName: model.modelName || '',
        modelPath: model.modelPath || '',
        slug: model.slug || '',
        imageUrl: model.imageUrl || '',
        fileId: model.fileId || '',
        companyName: model.companyName || '',
        year: model.year || '',
        userId: model.userId || '',
        isCustom: model.isCustom || false,
      })) as CarModel[];

      // Filter models: show pre-uploaded (owner) and user's own models
      const filteredModels = typedModels.filter(model => {
        return model.userId === "owner" || model.userId === user?.id;
      });
      
      setModels(filteredModels);
      
      // Set initial car config based on slug or first model
      let initialModel: CarModel | undefined;
      if (slug) {
        initialModel = filteredModels.find(m => m.slug === slug);
      }
      if (!initialModel && filteredModels.length > 0) {
          initialModel = filteredModels[0];
      }

      if (initialModel) {
          setCarConfig((prev) => ({
            ...prev,
            modelPath: initialModel!.modelPath,
            modelName: initialModel!.modelName,
            imageUrl: initialModel!.imageUrl,
            fileId: initialModel!.fileId,
          }));
      } else {
         // Handle case where no models are available or slug doesn't match
         console.warn('No suitable initial model found.');
         // Optionally set a default model or leave it blank
         // setCarConfig((prev) => ({ ...prev, modelPath: defaultModelPath, modelName: 'Default Model' })); 
      }

    } catch (error) {
      console.error('Error fetching car models:', error);
      toast.error('Failed to load car models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [slug, user?.id]); // Re-fetch when user changes or slug changes

  const handleUploadComplete = () => {
    fetchModels(); // Refresh model list after upload
  };

  // Filter models for the dropdown
  const preUploadedModels = useMemo(() => models.filter(model => model.userId === "owner"), [models]);
  const userModels = useMemo(() => models.filter(model => model.userId === user?.id), [models, user?.id]);

  const handleModelChange = (newModelId: string) => {
    const selected = models.find((m: CarModel) => m.fileId === newModelId) // Find by fileId
    if (selected) {
      setCarConfig((prev) => ({
        ...prev,
        modelPath: selected.modelPath,
        modelName: selected.modelName,
        imageUrl: selected.imageUrl,
        fileId: selected.fileId,
      }))
      // Update the URL without full page reload
      router.push(`/customize/${selected.slug}`, { scroll: false });
    }
  }

  const handleDeleteModel = async (model: CarModel) => {
    if (!confirm(`Are you sure you want to delete ${model.modelName}? This cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true); // Use setLoading or add a specific isDeleting state
      const result = await deleteCarModelAndFiles(model.$id, model.fileId, model.imageUrl);
      
      if (result) {
        toast.success("Model deleted successfully");
        // Re-fetch models to update the list and potentially select a new default
        await fetchModels(); 
      } else {
        throw new Error('Delete operation failed in backend');
      }
    } catch (error) {
      console.error("Error deleting model:", error);
      toast.error("Failed to delete model. Please try again.");
      setLoading(false); // Ensure loading state is turned off on error
    }
     // setLoading(false) will be called in fetchModels' finally block
  };

  const saveConfiguration = async () => {
    if (!user) {
        toast.error("You must be logged in to save configurations.");
        return;
    }
    if (!carConfig.fileId) {
        toast.error("No model selected to save.");
        return;
    }
    
    setIsSaving(true);
    try {
      const payload = {
        userId: user.id,
        userEmail: user.primaryEmailAddress?.emailAddress,
        userName: user.fullName,
        modelId: carConfig.fileId, // Use fileId which should be consistent
        modelName: carConfig.modelName,
        bodyColor: carConfig.bodyColor,
        wheelColor: carConfig.wheelColor,
        wheelScale: carConfig.wheelScale.toString(),
        finish: carConfig.finish,
        isShared: "false", // Default to not shared
        createdAt: new Date().toISOString()
      };

      console.log("Saving config payload:", payload);

      const response = await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to save configuration");
      }

      toast.success("Configuration saved successfully!");
      // Optionally redirect or update UI
      // router.push(`/view/${data.configId}`); // Example redirect to view page

    } catch (error: any) {
      console.error("Error saving configuration:", error);
      toast.error("Error saving configuration: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 bg-muted/30 rounded-lg overflow-hidden shadow-sm h-[500px] lg:h-[700px] relative">
        {loading && !carConfig.modelPath ? ( // Show loader only if truly loading initial model
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            <p className="ml-4 text-muted-foreground">Loading models...</p>
          </div>
        ) : (
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
          }>
            <Canvas shadows camera={{ position: [0, 1, 10], fov: 50 }}> // Slightly adjusted camera
              <Stage environment="city" intensity={0.6} adjustCamera={1.2}> // Use Stage lighting
                {carConfig.modelPath ? (
                   <Car {...carConfig} />
                 ) : (
                   <Html center><div>Select a model to view</div></Html> // Placeholder if no model
                 )}
              </Stage>
              <OrbitControls enableZoom={true} enablePan={true} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
              {/* <Environment preset="city" /> // Environment can be set in Stage */}
            </Canvas>
          </Suspense>
        )}
      </div>

      <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Customize Your Car</h2>

            <Tabs defaultValue="color">
              <TabsList className="grid grid-cols-4 mb-4 w-full">
                <TabsTrigger value="color">Color</TabsTrigger>
                <TabsTrigger value="accessories">Parts</TabsTrigger>
                <TabsTrigger value="model">Model</TabsTrigger>
                <TabsTrigger value="view">Add Model</TabsTrigger>
              </TabsList>

              <TabsContent value="color" className="space-y-4">
                <ColorPicker
                  bodyColor={carConfig.bodyColor}
                  wheelColor={carConfig.wheelColor}
                  onBodyColorChange={(color) => setCarConfig((prev) => ({ ...prev, bodyColor: color }))}
                  onWheelColorChange={(color) => setCarConfig((prev) => ({ ...prev, wheelColor: color }))}
                />

                <div className="space-y-2 pt-4">
                  <Label htmlFor="finish">Finish</Label>
                  <Select
                    value={carConfig.finish}
                    onValueChange={(value) =>
                      setCarConfig((prev) => ({ ...prev, finish: value as "glossy" | "matte" }))
                    }
                  >
                    <SelectTrigger id="finish">
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
                      min={0.8} // Adjusted min slightly
                      max={1.2}
                      step={0.05} // Finer step
                      value={[carConfig.wheelScale || 1]}
                      onValueChange={(value) => setCarConfig((prev) => ({ ...prev, wheelScale: value[0] }))}
                    />
                    <span className="text-sm font-mono w-10 text-right">{carConfig.wheelScale.toFixed(2)}x</span>
                  </div>
                </div>
                {/* Add other accessory selectors here if needed */}
              </TabsContent>

              <TabsContent value="model" className="space-y-4">
                <Label htmlFor="car-model">Select Car Model</Label>
                <Select onValueChange={handleModelChange} value={carConfig.fileId} disabled={loading}> 
                  <SelectTrigger id="car-model">
                    <SelectValue placeholder={loading ? "Loading models..." : "Select a Model"} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Pre-uploaded Models */}
                    {preUploadedModels.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          Default Models
                        </div>
                        {preUploadedModels.map((model: CarModel) => (
                          <SelectItem 
                            key={model.$id} 
                            value={model.fileId} // Use fileId as value
                          >
                            {model.companyName} {model.modelName} {model.year ? `(${model.year})` : ''}
                          </SelectItem>
                        ))}
                      </>
                    )}
                    
                    {/* User's Custom Models */}
                    {userModels.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          Your Models
                        </div>
                        {userModels.map((model: CarModel) => (
                           <div key={model.$id} className="relative flex items-center justify-between group pr-2">
                              <SelectItem 
                                value={model.fileId} // Use fileId as value
                                className="flex-grow"
                              >
                                {model.companyName || 'Custom'} {model.modelName} {model.year ? `(${model.year})` : ''}
                              </SelectItem>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 flex-shrink-0"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent Select from closing
                                  e.stopPropagation(); // Stop propagation to SelectItem
                                  handleDeleteModel(model);
                                }}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                        ))}
                      </>
                    )}
                    {models.length === 0 && !loading && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No models available.
                        </div>
                    )}
                  </SelectContent>
                </Select>
              </TabsContent>

              <TabsContent value="view" className="space-y-4">
                <ModelUpload onUploadComplete={handleUploadComplete} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* This is the correct save button */}
        <Button className="w-full" size="lg" onClick={saveConfiguration} disabled={isSaving || loading || !user || !carConfig.fileId}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Configuration"
          )}
        </Button>

        {/* Removed the redundant button that called saveCar */}
        {/* <Button onClick={saveCar} className="w-full" size="lg">Save Car</Button> */}

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Current Configuration</h3>
            <div className="text-sm space-y-1 text-muted-foreground overflow-hidden">
              <p>
                Model: <span className="font-mono font-semibold">{carConfig.modelName || "N/A"}</span>
              </p>
              <p className="flex items-center gap-2">
                Body:
                <span
                  className="inline-block w-4 h-4 rounded border border-input"
                  style={{ backgroundColor: carConfig.bodyColor }}
                ></span>
                <span className="font-mono">{carConfig.bodyColor}</span> 
                 (<span className="font-mono">{carConfig.finish}</span>)
              </p>
              <p className="flex items-center gap-2">
                Accent:
                <span
                  className="inline-block w-4 h-4 rounded border border-input"
                  style={{ backgroundColor: carConfig.wheelColor }}
                ></span>
                <span className="font-mono">{carConfig.wheelColor}</span>
              </p>
              <p>
                Wheel Size: <span className="font-mono">{carConfig.wheelScale.toFixed(2)}x</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

