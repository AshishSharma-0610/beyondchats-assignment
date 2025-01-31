import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/useDebounce"

export function SmartSuggestions({ field, value, onSelect }) {
    const [suggestions, setSuggestions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const debouncedValue = useDebounce(value, 300)

    useEffect(() => {
        if (!debouncedValue) {
            setSuggestions([])
            return
        }

        const getSuggestions = async () => {
            setIsLoading(true)
            // Simulate API call for suggestions
            await new Promise((resolve) => setTimeout(resolve, 500))

            // Demo suggestions based on field type
            const mockSuggestions = {
                companyName: ["Technologies", "Solutions", "Industries", "Innovations"],
                companyDescription: [
                    "We specialize in innovative solutions...",
                    "Our mission is to transform...",
                    "Leading provider of...",
                ],
            }

            setSuggestions(
                mockSuggestions[field]?.filter((s) => s.toLowerCase().includes(debouncedValue.toLowerCase()))?.slice(0, 3) ||
                [],
            )
            setIsLoading(false)
        }

        getSuggestions()
    }, [debouncedValue, field])

    if (!suggestions.length && !isLoading) return null

    return (
        <div className="mt-2 space-y-2 animate-in fade-in-50">
            {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading suggestions...</p>
            ) : (
                suggestions.map((suggestion, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onSelect(suggestion)}
                    >
                        {suggestion}
                    </Button>
                ))
            )}
        </div>
    )
}

