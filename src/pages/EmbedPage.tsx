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
        <div className="p-3 sm:p-4 md:p-6 bg-slate-900 min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
            <p className="text-white/70 text-sm">Loading widget...</p>
          </div>
        </div>
    )
  }

  if (!widget) {
    return (
        <div className="p-3 sm:p-4 md:p-6 bg-slate-900 min-h-screen flex items-center justify-center">
          <div className="text-foreground text-center max-w-sm mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Widget Not Found</h1>
            <p className="text-sm sm:text-base text-white/70">The requested widget could not be found.</p>
          </div>
        </div>
    )
  }

  return (
      <div className="p-3 sm:p-4 md:p-6 bg-transparent min-h-screen">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {widget.items.map((item) => (
                <div key={item.id} className="bg-slate-800/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-foreground font-medium mb-2 text-sm sm:text-base leading-tight">
                    <span className="block sm:hidden truncate" title={item.label}>
                      {item.label.length > 25 ? `${item.label.substring(0, 25)}...` : item.label}
                    </span>
                        <span className="hidden sm:block truncate" title={item.label}>
                      {item.label}
                    </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 sm:h-2.5">
                        <div
                            className={`bg-${item.color}-500 h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-foreground font-bold shrink-0 text-right sm:text-left">
                      <span className="text-lg sm:text-xl">{item.percentage.toFixed(0)}</span>
                      <span className="text-sm text-white/70">%</span>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Optional: Add a subtle footer for very small screens */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/40">Progress Widget • {widget.items.length} items</p>
          </div>
        </div>
      </div>
  )
}
