"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useSetup } from "../context/setup-context"
import { Check, Copy, Send, ArrowLeft, Loader2, ExternalLink, AlertTriangle } from "lucide-react"
import confetti from "canvas-confetti"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useSwipeable } from "react-swipeable"
import { SocialShare } from "./social-share"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/toaster"
import { BottomSheet } from "./ui/bottom-sheet"
import { ContentSkeleton } from "./ui/content-skeleton"

/**
 * Integration setup component that handles the final step of the setup process
 * Includes code copying, integration testing, and success celebration
 */
export default function IntegrationSetup() {
    const { prevStep, formData } = useSetup()
    const [copied, setCopied] = useState(false)  // Tracks if code is copied
    const [testStatus, setTestStatus] = useState("idle")  // Tracks test status (idle, testing, success, error)
    const [showPreview, setShowPreview] = useState(false)  // Manages preview visibility
    const [retryCount, setRetryCount] = useState(0)  // Tracks retry attempts
    const [isLoading, setIsLoading] = useState(true)  // Loading state for the component
    const { addToast } = useToast()  // Toast notifications
    const [isMobile, setIsMobile] = useState(false)  // Detects mobile screen size

    // Detects mobile screen and sets loading timeout
    useEffect(() => {
        setIsMobile(window.innerWidth < 768)
        const timer = setTimeout(() => setIsLoading(false), 1500)
        return () => clearTimeout(timer)
    }, [])

    // Swipe handlers for mobile devices
    const swipeHandlers = useSwipeable({
        onSwipedRight: () => prevStep(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    })

    // Handle copying the integration code to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(integrationCode)
            setCopied(true)
            addToast("Code copied to clipboard!", "success")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            addToast("Failed to copy code", "error")
        }
    }

    // Simulate integration test and show results (success or error)
    const handleTest = async () => {
        setTestStatus("testing")
        await new Promise((resolve) => setTimeout(resolve, 2000))  // Simulate test delay

        // Randomize success or error based on retry count
        const shouldSucceed = retryCount >= 2 || Math.random() > 0.5

        if (shouldSucceed) {
            setTestStatus("success")
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            })
            addToast("Integration successful!", "success")
        } else {
            setTestStatus("error")
            setRetryCount((prev) => prev + 1)
            addToast("Integration test failed. Please try again.", "error")
        }
    }

    // Dynamically generate the integration code
    const integrationCode = `<!-- BeyondChats Widget -->
<script>
window.beyondchats = {
  id: '${Math.random().toString(36).substring(7)}',
  theme: 'light',
  company: '${formData.companyName}'
}
</script>
<script src="https://cdn.beyondchats.com/widget.js" async></script>`

    // Show skeleton loading state while content is loading
    if (isLoading) {
        return <ContentSkeleton />
    }

    // Preview content of the chatbot for the user
    const PreviewContent = () => (
        <div className="h-[400px] rounded-lg border bg-background p-4">
            <div className="flex h-full flex-col">
                <div className="flex items-center gap-2 border-b p-2">
                    <div className="h-8 w-8 rounded-full bg-primary" />
                    <div>
                        <p className="font-medium">{formData.companyName}</p>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <div className="mb-4 flex">
                        <div className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                            Hello! How can I help you today?
                        </div>
                    </div>
                </div>
                <div className="border-t p-4">
                    <div className="rounded-lg border bg-muted px-3 py-2 text-sm">Type your message...</div>
                </div>
            </div>
        </div>
    )

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            {...swipeHandlers}
        >
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tighter">Add Chatbot to Your Website</h1>
                <p className="text-gray-500 dark:text-gray-400">Follow these steps to integrate your chatbot</p>
            </div>

            <div className="space-y-6">
                {/* Integration Code Section */}
                <div className="rounded-lg border bg-muted p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Label>Integration Code</Label>
                        <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2">
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                    <pre className="text-sm bg-background p-4 rounded-md overflow-x-auto">{integrationCode}</pre>
                </div>

                {/* Preview & Test Integration Buttons */}
                <div className="grid gap-4 md:grid-cols-2">
                    {isMobile ? (
                        <Button className="w-full" variant="outline" onClick={() => setShowPreview(true)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Preview Chatbot
                        </Button>
                    ) : (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full" variant="outline">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Preview Chatbot
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Chatbot Preview</DialogTitle>
                                    <DialogDescription>This is how your chatbot will appear on your website</DialogDescription>
                                </DialogHeader>
                                <PreviewContent />
                            </DialogContent>
                        </Dialog>
                    )}

                    {/* Test Integration Button */}
                    <Button
                        className="w-full"
                        onClick={handleTest}
                        disabled={testStatus === "testing"}
                        variant={testStatus === "success" ? "outline" : "default"}
                    >
                        {testStatus === "success" ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Integration Successful
                            </>
                        ) : testStatus === "testing" ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Testing Integration...
                            </>
                        ) : testStatus === "error" ? (
                            <>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Test Failed - Retry
                            </>
                        ) : (
                            "Test Integration"
                        )}
                    </Button>
                </div>

                {/* Error Message when test fails */}
                {testStatus === "error" && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Integration test failed. This could be due to:
                            <ul className="list-disc ml-4 mt-2">
                                <li>Network connectivity issues</li>
                                <li>Server configuration problems</li>
                                <li>Invalid integration code</li>
                            </ul>
                            <Button variant="link" className="mt-2 h-auto p-0" onClick={handleTest}>
                                Try again
                            </Button>
                            {retryCount >= 2 && <p className="mt-2 text-sm">Tip: The next attempt has a higher chance of success</p>}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Success Message & Further Actions */}
                {testStatus === "success" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <Alert className="border-green-500 text-green-500">
                            <Check className="h-4 w-4" />
                            <AlertDescription>Great job! Your chatbot is now ready to use.</AlertDescription>
                        </Alert>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Button className="w-full">Explore Admin Panel</Button>
                            <Button className="w-full" variant="outline">
                                Start Talking to Your Chatbot
                            </Button>
                        </div>
                        <SocialShare />
                    </div>
                )}

                {/* Back Button */}
                <div className="flex justify-start pt-4">
                    <Button variant="ghost" onClick={prevStep} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>
            </div>

            {/* Bottom sheet for mobile preview */}
            <BottomSheet isOpen={showPreview} onClose={() => setShowPreview(false)}>
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Preview</h3>
                    <PreviewContent />
                </div>
            </BottomSheet>
        </motion.div>
    )
}
