"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getWidget, incrementEmbedViews, type ProgressWidget } from "@/lib/firestore"

export default function EmbedPage() {
  const { id } = useParams<{ id: string }>()
  const [widget, setWidget] = useState<ProgressWidget | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadWidget()
    }
  }, [id])

  const loadWidget = async () => {
    if (!id) return

    try {
      const widgetData = await getWidget(id)
      setWidget(widgetData)

      // Increment view count (fire and forget)
      if (widgetData) {
        incrementEmbedViews(id).catch(console.error)
      }
    } catch (error) {
      console.error("Error loading widget:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!widget) {
    return (
      <div className="p-4 bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-foreground text-center">
          <h1 className="text-2xl font-bold mb-2">Widget Not Found</h1>
          <p>The requested widget could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4  min-h-screen">
      <div className="space-y-4 max-w-md">
        {widget.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            {item.image ? (
                <img
                    src={item.image}
                    alt={item.label}
                    className={`size-10 rounded-lg object-cover bg-${item.color}-500`}
                />
            ) : (
                <div
                    className={`size-10 bg-${item.color}-500 rounded-lg flex items-center justify-center text-lg`}
                />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-foreground font-medium mb-2 truncate">{item.label}</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`bg-${item.color}-500 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="text-foreground font-medium shrink-0">{item.percentage.toFixed(0)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
