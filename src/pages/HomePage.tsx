import {Link} from "react-router-dom"
import {Button} from "@/components/ui/button"
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {BarChart3, Palette, Settings, Zap, Sparkles} from "lucide-react"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to='/' className="flex items-center gap-2 group">
                        <BarChart3 className="w-8 h-8 text-blue-600 group-hover:text-blue-400 transition-colors"/>
                        <span className="text-xl font-bold text-foreground group-hover:text-blue-400 transition-colors">ProgressWidget</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="text-blue-600 font-medium hover:text-blue-400 hover:scale-95">
                            Sign In
                        </Link>
                        <Link to="/signup" >
                            <Button className="hover:bg-blue-500 hover:scale-95">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">Beautiful Progress Bars for Your Website</h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Create stunning, customizable progress bar widgets that showcase your skills, project completion, or
                    any
                    metric. Embed them anywhere with a simple code snippet.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link to="/login">
                        <Button size="lg" className="px-8">
                            <Sparkles className="w-4 h-4 mr-2"/>
                            Get Started
                        </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="px-8">
                        View Demo
                    </Button>
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">Why Choose ProgressWidget?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <Palette className="w-12 h-12 text-blue-600 mb-4"/>
                            <CardTitle>Fully Customizable</CardTitle>
                            <CardDescription>
                                Change colors, icons, text, and percentages to match your brand perfectly.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Zap className="w-12 h-12 text-green-600 mb-4"/>
                            <CardTitle>Easy to Embed</CardTitle>
                            <CardDescription>
                                Copy and paste a simple code snippet to add your progress bars anywhere.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Settings className="w-12 h-12 text-purple-600 mb-4"/>
                            <CardTitle>Real-time Updates</CardTitle>
                            <CardDescription>
                                Update your progress bars from your dashboard and see changes instantly.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* Demo Preview */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-8">Live Preview</h3>
                    <div className="bg-slate-900 rounded-lg p-6 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white"/>
                            </div>
                            <div className="flex-1">
                                <div className="text-white font-medium mb-2">Photography</div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{width: "70%"}}></div>
                                </div>
                            </div>
                            <div className="text-white font-medium">70%</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                <Settings className="w-6 h-6 text-white"/>
                            </div>
                            <div className="flex-1">
                                <div className="text-white font-medium mb-2">Videography</div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{width: "82%"}}></div>
                                </div>
                            </div>
                            <div className="text-white font-medium">82%</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <BarChart3 className="w-6 h-6"/>
                        <span className="text-lg font-bold">ProgressWidget</span>
                    </div>
                    <p className="text-gray-400">© 2024 ProgressWidget. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
