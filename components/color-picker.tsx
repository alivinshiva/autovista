"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  bodyColor: string
  wheelColor: string
  onBodyColorChange: (color: string) => void
  onWheelColorChange: (color: string) => void
  
}

const colorOptions = [
  { value: "#ef4444", label: "Red" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#22c55e", label: "Green" },
  { value: "#f59e0b", label: "Yellow" },
  { value: "#6b7280", label: "Gray" },
  { value: "#ffffff", label: "White" },
  { value: "#0f172a", label: "Black" },
  { value: "#8b5cf6", label: "Purple" },
]

export default function ColorPicker({
  bodyColor,
  wheelColor,
  onBodyColorChange,
  onWheelColorChange,
}: ColorPickerProps) {
  const [customBodyColor, setCustomBodyColor] = useState(bodyColor)
  const [customWheelColor, setCustomWheelColor] = useState(wheelColor)

  const handleCustomBodyColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setCustomBodyColor(color)
    onBodyColorChange(color)
  }

  const handleCustomWheelColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setCustomWheelColor(color)
    onWheelColorChange(color)
  }

  return (
    <div className="space-y-6">
      {/* Body Color */}
      <div>
        <Label className="text-base">Body Color</Label>
        <RadioGroup value={bodyColor} onValueChange={onBodyColorChange} className="grid grid-cols-4 gap-2 mt-2">
          {colorOptions.map((color) => (
            <ColorOption key={color.value} color={color} selectedColor={bodyColor} onChange={onBodyColorChange} />
          ))}
        </RadioGroup>
        <CustomColorInput
          label="Custom Body Color"
          color={customBodyColor}
          onColorChange={handleCustomBodyColorChange}
        />
      </div>

      {/* Wheel Color */}
      <div>
        <Label className="text-base">Accent Color</Label>
        <RadioGroup value={wheelColor} onValueChange={onWheelColorChange} className="grid grid-cols-4 gap-2 mt-2">
          {colorOptions.map((color) => (
            <ColorOption key={color.value} color={color} selectedColor={wheelColor} onChange={onWheelColorChange} />
          ))}
        </RadioGroup>
        <CustomColorInput
          label="Custom Wheel Color"
          color={customWheelColor}
          onColorChange={handleCustomWheelColorChange}
        />
      </div>

      
    </div>
  )
}

const ColorOption = ({
  color,
  selectedColor,
  onChange,
}: {
  color: { value: string; label: string }
  selectedColor: string
  onChange: (color: string) => void
}) => (
  <div className="flex flex-col items-center space-y-1">
    <RadioGroupItem
      value={color.value}
      id={`color-${color.value}`}
      checked={selectedColor === color.value}
      onChange={() => onChange(color.value)}
      className="peer sr-only"
    />
    <Label
      htmlFor={`color-${color.value}`}
      className={`flex flex-col items-center justify-between rounded-md border-2 p-2 cursor-pointer 
        ${selectedColor === color.value ? "border-primary" : "border-muted"} hover:border-accent`}
      onClick={() => onChange(color.value)}
    >
      <div className="w-8 h-8 rounded-full border border-slate-300" style={{ backgroundColor: color.value }} />
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
