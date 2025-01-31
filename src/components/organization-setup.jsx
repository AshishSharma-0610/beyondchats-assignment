"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSetup } from "@/context/setup-context"
import { Check, Loader2, Globe, ArrowRight, ArrowLeft, ExternalLink } from "lucide-react"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDebounce } from "@/hooks/useDebounce"
import { validateUrl } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider } from "@/components/ui/tooltip" // Import TooltipProvider

// Mock data simulating website scraping process
const mockPages = [
    {
        url: "/",
        status: "completed",
        chunks: [
            { id: 1, content: "Welcome to our innovative solutions..." },
            { id: 2, content: "We provide cutting-edge technology..." },
        ],
    },
    {
        url: "/about",
        status: "completed",
        chunks: [
            { id: 3, content: "Our team of experts..." },
            { id: 4, content: "Founded in 2020..." },
        ],
    },
    {
        url: "/services",
        status: "pending",
        chunks: [],
    },
    {
        url: "/contact",
        status: "scraping",
        chunks: [{ id: 5, content: "Get in touch with us..." }],
    },
]

export default function OrganizationSetup() {
    const { nextStep, prevStep, updateFormData, formData: contextFormData } = useSetup()
    const [isLoading, setIsLoading] = useState(false)
    const [websiteData, setWebsiteData] = useState(null)
    const [scrapedPages, setScrapedPages] = useState(mockPages) // Initially mock scraping data
    const [selectedPage, setSelectedPage] = useState(null)
    const [overallProgress, setOverallProgress] = useState(0) // Overall scraping progress
    const [formData, setFormData] = useState({
        companyName: contextFormData.companyName || "",
        website: contextFormData.website || "",
        description: contextFormData.description || "",
    })
    const [errors, setErrors] = useState({})

    const debouncedWebsite = useDebounce(formData.website, 500) // Debouncing website input for efficiency

    // Effect to fetch website data when URL is valid and debounced
    useEffect(() => {
        if (debouncedWebsite && validateUrl(debouncedWebsite)) {
            fetchWebsiteData()
        }
    }, [debouncedWebsite])

    // Simulate website scraping progress and update state
    useEffect(() => {
        const interval = setInterval(() => {
            setScrapedPages((prev) => {
                const updated = [...prev]
                const pendingIndex = updated.findIndex((p) => p.status === "pending")
                if (pendingIndex !== -1) {
                    updated[pendingIndex].status = "scraping" // Change status to 'scraping' for pending page
                }
                return updated
            })

            setOverallProgress((prev) => {
                const newProgress = Math.min(prev + 5, 100)
                if (newProgress === 100) {
                    clearInterval(interval) // Stop the interval when progress reaches 100%
                }
                return newProgress
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // Simulate fetching website data (e.g., title and description)
    const fetchWebsiteData = async () => {
        setIsLoading(true)

        try {
            // Simulating API call
            await new Promise((resolve) => setTimeout(resolve, 1500))
            const mockData = {
                title: "Example Company",
                description: "A leading provider of innovative solutions...",
            }
            setWebsiteData(mockData) // Set the website data after fetch
            setFormData((prev) => ({
                ...prev,
                description: mockData.description, // Set description based on fetched data
            }))
        } catch (error) {
            console.error("Error fetching website data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Handle form submission after validation
    const handleSubmit = async () => {
        // Validate form fields
        const newErrors = {}
        if (!formData.companyName) newErrors.companyName = "Company name is required"
        if (!formData.description) newErrors.description = "Description is required"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors) // Set errors if validation fails
            return
        }

        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            updateFormData(formData) // Update context with form data
            nextStep() // Proceed to the next step
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Get status color based on page scraping status
    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-500"
            case "scraping":
                return "bg-blue-500"
            case "pending":
                return "bg-gray-500"
            case "failed":
                return "bg-red-500"
            default:
                return "bg-gray-500"
        }
    }

    return (
        <TooltipProvider> {/* TooltipProvider for tooltips functionality */}
            <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter">Organization Setup</h1>
                    <p className="text-muted-foreground">Tell us about your company</p>
                </div>

                {/* Company Name Input */}
                <div className="space-y-2">
                    <Label htmlFor="companyName">
                        Company Name
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, companyName: e.target.value }))
                            setErrors(prev => ({ ...prev, companyName: null })) // Clear error on change
                        }}
                        className={errors.companyName ? "border-destructive" : ""}
                    />
                    {errors.companyName && (
                        <p className="text-sm text-destructive">{errors.companyName}</p>
                    )}
                </div>

                {/* Website URL Input */}
                <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <div className="relative">
                        <Input
                            id="website"
                            type="url"
                            value={formData.website}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, website: e.target.value }))
                                setErrors(prev => ({ ...prev, website: null })) // Clear error on change
                            }}
                            className={errors.website ? "border-destructive pr-10" : "pr-10"}
                        />
                        <div className="absolute right-3 top-2.5">
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            ) : (
                                <Globe className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>
                    </div>
                    {websiteData && (
                        <Alert>
                            <Check className="h-4 w-4" />
                            <AlertDescription>Website data successfully retrieved</AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                    <Label htmlFor="description">
                        Company Description
                        <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, description: e.target.value }))
                            setErrors(prev => ({ ...prev, description: null })) // Clear error on change
                        }}
                        className={errors.description ? "border-destructive" : ""}
                        rows={4}
                    />
                    {errors.description && (
                        <p className="text-sm text-destructive">{errors.description}</p>
                    )}
                </div>

                {/* Scraping Progress */}
                {formData.website && (
                    <div className="space-y-4 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Website Scraping Progress</h3>
                            <Badge variant={overallProgress === 100 ? "default" : "secondary"}>
                                {overallProgress === 100 ? "Complete" : "In Progress"}
                            </Badge>
                        </div>

                        <Progress value={overallProgress} className="h-2" />

                        <Accordion type="single" collapsible>
                            {scrapedPages.map((page, index) => (
                                <AccordionItem key={index} value={`page-${index}`}>
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center space-x-2">
                                            <div className={`h-2 w-2 rounded-full ${getStatusColor(page.status)}`} />
                                            <span>{page.url}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Status: {page.status}
                                                </span>
                                                {page.chunks.length > 0 && (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                View Data
                                                                <ExternalLink className="ml-2 h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Data Chunks - {page.url}</DialogTitle>
                                                                <DialogDescription>
                                                                    Content extracted from this page
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <ScrollArea className="h-[400px] rounded-md border p-4">
                                                                <div className="space-y-4">
                                                                    {page.chunks.map((chunk) => (
                                                                        <div
                                                                            key={chunk.id}
                                                                            className="rounded-lg border bg-muted p-3"
                                                                        >
                                                                            <p className="text-sm">{chunk.content}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </ScrollArea>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={prevStep} disabled={isLoading}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <TooltipWrapper content={overallProgress < 100 ? "You can proceed while scraping continues" : "Continue to next step"}>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </TooltipWrapper>
                </div>
            </motion.div>
        </TooltipProvider>
    )
}
