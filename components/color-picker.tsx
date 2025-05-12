"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils" // Assuming you have a cn utility

interface ColorPickerProps {
  bodyColor: string
  wheelColor: string
  onBodyColorChange: (color: string) => void
  onWheelColorChange: (color: string) => void
}

interface ColorOptionData {
  value: string
  label: string
}

const bodyColorGroups: Record<string, ColorOptionData[]> = {
  Neutrals: [
    { value: "#1c1c1e", label: "Jet Black" },
    { value: "#f4f4f4", label: "Pearl White" },
    { value: "#2c2d3c", label: "Magnetic Gray" },
  ],
  Blues: [
    { value: "#003366", label: "Deep Navy Blue" },
    { value: "#5f819d", label: "Ice Blue Metallic" },
    { value: "#00c8d7", label: "Sky Cyan" },
    { value: "#009ca6", label: "Teal Blue" },
    { value: "#00ffff", label: "Electric Cyan" },
  ],
  Earth: [
    { value: "#556b2f", label: "Olive Green" },
    { value: "#483c32", label: "Mocha Brown" },
  ],
  Special: [
    { value: "#a6192e", label: "Crimson Red" },
    { value: "#c47400", label: "Copper Orange" },
    { value: "#8e3e63", label: "Royal Burgundy" },
  ],
}

const wheelColorOptions: ColorOptionData[] = [
  { value: "#1c1c1e", label: "Jet Black" },
  { value: "#6b7280", label: "Gunmetal Gray" },
  { value: "#d4d4d4", label: "Metallic Silver" },
]

export default function ColorPicker({
  bodyColor,
  wheelColor,
  onBodyColorChange,
  onWheelColorChange,
}: ColorPickerProps) {
  const [customBodyColor, setCustomBodyColor] = useState(() => 
    !Object.values(bodyColorGroups).flat().some(c => c.value === bodyColor) ? bodyColor : "#1c1c1e"
  )
  const [customWheelColor, setCustomWheelColor] = useState(() =>
    !wheelColorOptions.some(c => c.value === wheelColor) ? wheelColor : "#1c1c1e"
  )
  const [activeTab, setActiveTab] = useState<string>(() => 
    Object.keys(bodyColorGroups).find(group => bodyColorGroups[group].some(c => c.value === bodyColor)) || "Neutrals"
  )

  const handleBodyColorChange = (value: string) => {
    onBodyColorChange(value)
    const group = Object.keys(bodyColorGroups).find(g => bodyColorGroups[g].some(c => c.value === value));
    if (group) {
      setActiveTab(group);
    }
  }
  
  const handleWheelColorChange = (value: string) => {
    onWheelColorChange(value)
  }

  return (
    <div className="space-y-6">
      {/* Body Color */}
      <div>
        <Label className="text-base">Body Color</Label>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-4 h-auto flex-wrap">
            {Object.keys(bodyColorGroups).map((group) => (
              <TabsTrigger key={group} value={group} className="text-xs px-2">{group}</TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(bodyColorGroups).map(([group, colors]) => (
            <TabsContent key={group} value={group}>
              <RadioGroup value={bodyColor} onValueChange={handleBodyColorChange} className="grid grid-cols-4 gap-2 mt-2">
                {colors.map((color) => (
                  <ColorOption key={`body-${color.value}`} prefix="body" color={color} selectedColor={bodyColor} />
                ))}
              </RadioGroup>
            </TabsContent>
          ))}
        </Tabs>
        <CustomColorInput
          label="Custom Body Color"
          color={customBodyColor}
          onColorChange={(e) => {
            const c = e.target.value
            setCustomBodyColor(c)
            handleBodyColorChange(c)
          }}
        />
      </div>

      {/* Wheel Color */}
      <div>
        <Label className="text-base">Accent Color</Label>
        <RadioGroup value={wheelColor} onValueChange={handleWheelColorChange} className="grid grid-cols-4 gap-2 mt-2">
          {wheelColorOptions.map((color) => (
            <ColorOption key={`wheel-${color.value}`} prefix="wheel" color={color} selectedColor={wheelColor} />
          ))}
        </RadioGroup>
        <CustomColorInput
          label="Custom Wheel Color"
          color={customWheelColor}
          onColorChange={(e) => {
            const c = e.target.value
            setCustomWheelColor(c)
            handleWheelColorChange(c)
          }}
        />
      </div>
    </div>
  )
}

const ColorOption = ({
  prefix,
  color,
  selectedColor,
}: {
  prefix: string
  color: ColorOptionData
  selectedColor: string
}) => (
  <div className="flex flex-col items-center space-y-1">
    <RadioGroupItem
      value={color.value}
      id={`${prefix}-color-${color.value}`}
      // Removed checked property as RadioGroup handles it
      className="peer sr-only"
    />
    <Label
      htmlFor={`${prefix}-color-${color.value}`}
      className={cn(
        "flex flex-col items-center justify-between rounded-md border-2 p-2 cursor-pointer",
        selectedColor === color.value ? "border-primary" : "border-muted",
        "hover:border-accent hover:text-accent-foreground"
      )}
    >
      <div
        className="border border-slate-300 w-8 h-8 rounded-md"
        style={{ backgroundColor: color.value }}
        title={color.label}
      />
      <span className="mt-1 text-xs text-center truncate w-full">{color.label}</span>
    </Label>
  </div>
)

const CustomColorInput = ({
  label,
  color,
  onColorChange,
}: {
  label: string
  color: string
  onColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className="mt-4">
    {/* <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")} className="text-sm font-medium"> */}
    {/*  {label} */}
    {/* </Label> */}
    <div className="flex items-center gap-2 mt-1">
      <div className="w-10 h-10 rounded-md border border-input" style={{ backgroundColor: color }} />
      <Input 
        type="text" // Use text input for better UX with hex codes
        value={color} 
        onChange={onColorChange} 
        className="w-full h-10"
        placeholder="#rrggbb"
        id={label.toLowerCase().replace(/\s+/g, "-")}
      />
      {/* Optional: Add a color swatch input for visual picking */}
      {/* <Input type="color" value={color} onChange={onColorChange} className="w-10 h-10 p-0 border-none cursor-pointer" style={{ flexShrink: 0 }} /> */}
    </div>
  </div>
)
