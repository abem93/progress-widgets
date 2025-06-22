import { Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { PublicRoute } from "@/components/PublicRoute"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import DashboardPage from "./pages/DashboardPage"
import CreateWidgetPage from "./pages/CreateWidgetPage"
import EditWidgetPage from "./pages/EditWidgetPage"
import EmbedPage from "./pages/EmbedPage"
import AuthCompletePage from "./pages/AuthCompletePage"

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <PublicRoute>
                        <SignupPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/create"
                element={
                    <ProtectedRoute>
                        <CreateWidgetPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/edit/:id"
                element={
                    <ProtectedRoute>
                        <EditWidgetPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/embed/:id" element={<EmbedPage />} />
            <Route path="/auth/complete" element={<AuthCompletePage />} />
        </Routes>
    )
}

export default App
