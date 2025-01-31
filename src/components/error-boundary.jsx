import React from "react"
import { Button } from "./ui/button"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { motion } from "framer-motion"

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorCount: 0,
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        this.setState((prev) => ({
            errorInfo,
            errorCount: prev.errorCount + 1,
        }))

        // Log to error reporting service
        console.error("Error caught by boundary:", error, errorInfo)
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        })

        // Clear local storage if multiple errors occur
        if (this.state.errorCount > 2) {
            localStorage.clear()
        }

        window.location.reload()
    }

    handleHome = () => {
        window.location.href = "/"
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 10, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                            </motion.div>
                            <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
                            <p className="text-muted-foreground">We're sorry, but there was an error loading this page.</p>
                        </div>

                        {(this.state.error || this.state.errorInfo) && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                className="bg-muted/50 rounded-lg p-4 text-left overflow-auto max-h-32"
                            >
                                <pre className="text-xs">
                                    {this.state.error?.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </motion.div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={this.handleReset} className="flex-1">
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Try again
                            </Button>
                            <Button variant="outline" onClick={this.handleHome} className="flex-1">
                                <Home className="mr-2 h-4 w-4" />
                                Go to homepage
                            </Button>
                        </div>

                        {this.state.errorCount > 2 && (
                            <p className="text-sm text-muted-foreground text-center">
                                Multiple errors detected. Try clearing your browser data or contacting support.
                            </p>
                        )}
                    </motion.div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary

