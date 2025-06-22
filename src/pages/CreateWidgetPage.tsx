"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { BarChart3, Plus, Trash2, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { createWidget, type ProgressItem } from "@/lib/firestore"

const colorOptions = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "teal", label: "Teal", class: "bg-teal-500" },
  { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
  { value: "lime", label: "Lime", class: "bg-lime-500" },
  { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
]

const MAX_FILE_SIZE = 1024 * 1024 // 1MB in bytes

function CreateWidgetContent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [widgetName, setWidgetName] = useState("")
  const [items, setItems] = useState<ProgressItem[]>([
    {
      id: "1",
      label: "Photography",
      percentage: 70,
      color: "blue",
      image: null,
      current: 70,
      goal: 100,
    },
  ])
  const [saving, setSaving] = useState(false)

  const addItem = () => {
    const newItem: ProgressItem = {
      id: Date.now().toString(),
      label: "New Skill",
      percentage: 50,
      color: "blue",
      image: null,
      current: 50,
      goal: 100,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }


  const updateItem = (id: string, field: keyof ProgressItem, value: any) => {
    setItems(items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }

        // Auto-calculate percentage when current or goal changes (but not when percentage is manually set)
        if (field === 'current' || field === 'goal') {
          const current = field === 'current' ? value : item.current
          const goal = field === 'goal' ? value : item.goal

          // Ensure goal is not zero to avoid division by zero
          if (goal > 0) {
            updatedItem.percentage = Math.min(100, Math.max(0, (current / goal) * 100))
          } else {
            updatedItem.percentage = 0
          }
        }

        return updatedItem
      }
      return item
    }))
  }

  const handleImageUpload = (itemId: string, file: File | null) => {
    if (!file) {
      updateItem(itemId, "image", null)
      return
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 1MB")
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file")
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        updateItem(itemId, "image", e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!user || !widgetName || items.length === 0) return

    setSaving(true)
    try {
      await createWidget({
        name: widgetName,
        items,
        userId: user.uid,
      })
      navigate("/dashboard")
    } catch (error) {
      console.error("Error creating widget:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-semibold">Create New Widget</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!widgetName || items.length === 0 || saving}>
                {saving ? "Saving..." : "Save Widget"}
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Editor */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Widget Settings</CardTitle>
                  <CardDescription>Configure your progress bar widget</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="widget-name">Widget Name</Label>
                    <Input
                        id="widget-name"
                        placeholder="e.g., My Skills, Project Progress"
                        value={widgetName}
                        onChange={(e) => setWidgetName(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Progress Items</CardTitle>
                      <CardDescription>Add and configure your progress bars</CardDescription>
                    </div>
                    <Button onClick={addItem} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {items.map((item, index) => (
                      <div key={item.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Item {index + 1}</h4>
                          {items.length > 1 && (
                              <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                                value={item.label}
                                onChange={(e) => updateItem(item.id, "label", e.target.value)}
                                placeholder="e.g., Photography"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Image</Label>
                            <div className="flex items-center gap-4">
                              {item.image ? (
                                  <div className="relative">
                                    <img
                                        src={item.image}
                                        alt="Preview"
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleImageUpload(item.id, null)}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                                    >
                                      ×
                                    </button>
                                  </div>
                              ) : (
                                  <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">No image</span>
                                  </div>
                              )}
                              <div className="flex-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null
                                      handleImageUpload(item.id, file)
                                    }}
                                    className="text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">Max 1MB</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Current Value</Label>
                            <Input
                                type="number"
                                value={item.current}
                                onChange={(e) => updateItem(item.id, "current", parseInt(e.target.value) || 0)}
                                placeholder="0"
                                min="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Goal</Label>
                            <Input
                                type="number"
                                value={item.goal}
                                onChange={(e) => updateItem(item.id, "goal", parseInt(e.target.value) || 100)}
                                placeholder="100"
                                min="1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Color</Label>
                          <div className="flex gap-2 flex-wrap">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    className={`w-8 h-8 rounded-full ${color.class} ${
                                        item.color === color.value ? "ring-2 ring-offset-2 ring-gray-400" : ""
                                    }`}
                                    onClick={() => updateItem(item.id, "color", color.value)}
                                />
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Slider
                              value={[item.percentage]}
                              onValueChange={(value) => updateItem(item.id, "percentage", value[0])}
                              max={100}
                              step={1}
                              className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{item.current} / {item.goal}</span>
                            <span>{(((item.current??0) / (item.goal??100)) * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>See how your widget will look when embedded</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 rounded-lg p-6 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div
                              className={`w-12 h-12 bg-${item.color}-500 rounded-lg flex items-center justify-center text-lg overflow-hidden`}
                          >
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.label}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white">?</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium mb-2">{item.label}</div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                  className={`bg-${item.color}-500 h-2 rounded-full transition-all duration-300`}
                                  style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-white font-medium">{item.percentage.toFixed(0)}%</div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Embed Code</CardTitle>
                  <CardDescription>Copy this code to embed your widget</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg p-4 text-sm font-mono">
                    {`<iframe 
  src="${window.location.origin}/embed/widget-id" 
  width="400" 
  height="${items.length * 80 + 40}"
  >
</iframe>`}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}

export default function CreateWidgetPage() {
  return (
      <ProtectedRoute>
        <CreateWidgetContent />
      </ProtectedRoute>
  )
}