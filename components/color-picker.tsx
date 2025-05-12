"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  bodyColor: string
  wheelColor: string
  onBodyColorChange: (color: string) => void
  onWheelColorChange: (color: string) => void
}

const bodyColorGroups = {
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

const wheelColorOptions = [
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
  const [customBodyColor, setCustomBodyColor] = useState(bodyColor)
  const [customWheelColor, setCustomWheelColor] = useState(wheelColor)
  const [activeTab, setActiveTab] = useState("Neutrals")

  return (
    <div className="space-y-6">
      {/* Body Color */}
      <div>
        <Label className="text-base">Body Color</Label>
        <RadioGroup value={bodyColor} onValueChange={onBodyColorChange} className="grid grid-cols-4 gap-2 mt-2">
          {colorOptions.map((color) => (
            <ColorOption key={`body-${color.value}`} prefix="body" color={color} selectedColor={bodyColor} />
          ))}
        </Tabs>
        <CustomColorInput
          label="Custom Body Color"
          color={customBodyColor}
          onColorChange={(e) => {
            const c = e.target.value
            setCustomBodyColor(c)
            onBodyColorChange(c)
          }}
        />
      </div>

      {/* Wheel Color */}
      <div>
        <Label className="text-base">Accent Color</Label>
        <RadioGroup value={wheelColor} onValueChange={onWheelColorChange} className="grid grid-cols-4 gap-2 mt-2">
          {colorOptions.map((color) => (
            <ColorOption key={`wheel-${color.value}`} prefix="wheel" color={color} selectedColor={wheelColor} />
          ))}
        </RadioGroup>
        <CustomColorInput
          label="Custom Wheel Color"
          color={customWheelColor}
          onColorChange={(e) => {
            const c = e.target.value
            setCustomWheelColor(c)
            onWheelColorChange(c)
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
  color: { value: string; label: string }
  selectedColor: string
}) => (
  <div className="flex flex-col items-center space-y-1">
    <RadioGroupItem
      value={color.value}
      id={`${prefix}-color-${color.value}`}
      checked={selectedColor === color.value}
      className="peer sr-only"
    />
    <Label
      htmlFor={`${prefix}-color-${color.value}`}
      className={`flex flex-col items-center justify-between rounded-md border-2 p-2 cursor-pointer 
        ${selectedColor === color.value ? "border-primary" : "border-muted"} hover:border-accent`}
    >
      <div
        className={`border border-slate-300 w-8 h-8 ${rounded ? "rounded-full" : "rounded-md"}`}
        style={{ backgroundColor: color.value }}
        title={color.label}
      />
      <span className="mt-1 text-xs">{color.label}</span>
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
  <div className="mt-2">
    <Label htmlFor={label.toLowerCase().replace(" ", "-")} className="text-base">
      {label}
    </Label>
    <div className="flex items-center gap-2 mt-1">
      <div className="w-10 h-10 rounded-md border border-slate-300" style={{ backgroundColor: color }} />
      <Input type="color" value={color} onChange={onColorChange} className="w-full h-10" />
    </div>
  </div>
)
