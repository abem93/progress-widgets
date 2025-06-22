"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Plus, Settings, Eye, Code, Trash2, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { getUserWidgets, deleteWidget, type ProgressWidget } from "@/lib/firestore"

function DashboardContent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [widgets, setWidgets] = useState<ProgressWidget[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadWidgets()
    }
  }, [user])

  const loadWidgets = async () => {
    if (!user) return

    try {
      const userWidgets = await getUserWidgets(user.uid)
      setWidgets(userWidgets)
    } catch (error) {
      console.error("Error loading widgets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWidget = async (widgetId: string) => {
    if (!confirm("Are you sure you want to delete this widget?")) return

    try {
      await deleteWidget(widgetId)
      setWidgets(widgets.filter((w) => w.id !== widgetId))
    } catch (error) {
      console.error("Error deleting widget:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const copyEmbedCode = (widgetId: string) => {
    const embedCode = `<iframe src="${window.location.origin}/embed/${widgetId}" width="400" height="320"></iframe>`
    navigator.clipboard.writeText(embedCode)
    // You could add a toast notification here
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">ProgressWidget</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your progress bar widgets</p>
          </div>
          <Link to="/dashboard/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Widget
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Widgets</CardDescription>
              <CardTitle className="text-3xl">{widgets.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Views</CardDescription>
              <CardTitle className="text-3xl">
                {widgets.reduce((sum, widget) => sum + widget.embedViews, 0).toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Embeds</CardDescription>
              <CardTitle className="text-3xl">{widgets.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Widgets List */}
        <div className="space-y-6">
          {widgets.map((widget) => (
            <Card key={widget.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {widget.name}
                      <Badge variant="secondary">{widget.items.length} items</Badge>
                    </CardTitle>
                    <CardDescription>
                      Created on {new Date(widget.createdAt).toLocaleDateString()} •{widget.embedViews.toLocaleString()}{" "}
                      views
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/dashboard/edit/${widget.id}`}>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/embed/${widget.id}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => copyEmbedCode(widget.id!)}>
                      <Code className="w-4 h-4 mr-2" />
                      Embed
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteWidget(widget.id!)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 rounded-lg p-4 space-y-4">
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
                      <div className="flex-1">
                        <div className="text-white font-medium mb-1">{item.label}</div>
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
          ))}
        </div>

        {widgets.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <CardTitle className="mb-2">No widgets yet</CardTitle>
              <CardDescription className="mb-4">Create your first progress bar widget to get started</CardDescription>
              <Link to="/dashboard/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Widget
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
