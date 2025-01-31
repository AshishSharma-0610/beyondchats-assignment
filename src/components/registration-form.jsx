"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSetup } from "../context/setup-context"
import { Mail, Lock, User, ArrowRight, Loader2, Check, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useDebounce } from "@/hooks/useDebounce"
import { validatePassword, validateEmail } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function RegistrationForm() {
    const { formData, updateFormData, nextStep } = useSetup()  // Fetch data and functions from context
    const [isVerifying, setIsVerifying] = useState(false)  // Track if we are in the email verification step
    const [verificationCode, setVerificationCode] = useState("")  // Verification code input state
    const [errors, setErrors] = useState({})  // State for form errors
    const [isLoading, setIsLoading] = useState(false)  // Track if form is being submitted
    const [passwordStrength, setPasswordStrength] = useState(0)  // Track password strength
    const [validations, setValidations] = useState({
        name: false,
        email: false,
        password: false,
    })  // Track form field validations (name, email, password)

    // Debounce email and password inputs for performance optimization
    const debouncedEmail = useDebounce(formData.email, 500)
    const debouncedPassword = useDebounce(formData.password, 300)

    // Real-time email validation on debounced email change
    useEffect(() => {
        if (debouncedEmail) {
            const isValid = validateEmail(debouncedEmail)  // Validate email
            setValidations((prev) => ({ ...prev, email: isValid }))  // Update email validation
            setErrors((prev) => ({
                ...prev,
                email: isValid ? null : "Please enter a valid email address",  // Set error if invalid
            }))
        }
    }, [debouncedEmail])

    // Real-time password validation on debounced password change
    useEffect(() => {
        if (debouncedPassword) {
            const { strength, isValid, checks } = validatePassword(debouncedPassword)  // Check password strength
            setPasswordStrength(strength * 20)  // Update password strength percentage
            setValidations((prev) => ({ ...prev, password: isValid }))  // Update password validation
            setErrors((prev) => ({
                ...prev,
                password: isValid ? null : "Password must be at least 8 characters: mix of numbers, letters, and special symbols",  // Set error if invalid
            }))
        }
    }, [debouncedPassword])

    // Name validation
    useEffect(() => {
        if (formData.name) {
            const isValid = formData.name.length >= 2  // Name must be at least 2 characters
            setValidations((prev) => ({ ...prev, name: isValid }))  // Update name validation
            setErrors((prev) => ({
                ...prev,
                name: isValid ? null : "Name must be at least 2 characters",  // Set error if invalid
            }))
        }
    }, [formData.name])

    // Handle form submission logic
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isVerifying) {  // If we're not verifying the email, proceed with registration
            if (!Object.values(validations).every(Boolean)) {  // Ensure all fields are valid
                return
            }

            setIsLoading(true)  // Set loading state to true while the request is being processed
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000))  // Simulate API call
                setIsLoading(false)  // Stop loading
                setIsVerifying(true)  // Move to verification step
            } catch (error) {
                setErrors((prev) => ({
                    ...prev,
                    submit: "Failed to create account. Please try again.",  // Show error if submission fails
                }))
                setIsLoading(false)
            }
        } else {  // If we're verifying the email
            setIsLoading(true)
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000))  // Simulate verification process
                if (verificationCode === "123456") {  // Check if verification code is correct
                    updateFormData({ isEmailVerified: true })  // Update context with email verification status
                    nextStep()  // Proceed to the next step
                } else {
                    setErrors((prev) => ({
                        ...prev,
                        verification: "Invalid verification code",  // Show error if code is incorrect
                    }))
                }
            } catch (error) {
                setErrors((prev) => ({
                    ...prev,
                    verification: "Failed to verify code. Please try again.",  // Show error on verification failure
                }))
            } finally {
                setIsLoading(false)
            }
        }
    }

    // Show skeleton loaders while loading (for better UX)
    if (isLoading && !isVerifying) {
        return (
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome to BeyondChats</h1>
                <p className="text-gray-500 dark:text-gray-400">Let's get started by setting up your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isVerifying ? (  // If not verifying, show registration form
                    <>
                        {/* Full Name Input */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Full Name
                                {validations.name && <Check className="inline-block w-4 h-4 ml-2 text-green-500" />}
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                                    value={formData.name}
                                    onChange={(e) => {
                                        updateFormData({ name: e.target.value })
                                    }}
                                    aria-invalid={errors.name ? "true" : "false"}
                                    aria-describedby={errors.name ? "name-error" : undefined}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-red-500" id="name-error" role="alert">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                                {validations.email && <Check className="inline-block w-4 h-4 ml-2 text-green-500" />}
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                                    value={formData.email}
                                    onChange={(e) => {
                                        updateFormData({ email: e.target.value })
                                    }}
                                    aria-invalid={errors.email ? "true" : "false"}
                                    aria-describedby={errors.email ? "email-error" : undefined}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500" id="email-error" role="alert">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password
                                {validations.password && <Check className="inline-block w-4 h-4 ml-2 text-green-500" />}
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                                    value={formData.password}
                                    onChange={(e) => {
                                        updateFormData({ password: e.target.value })
                                    }}
                                    aria-invalid={errors.password ? "true" : "false"}
                                    aria-describedby="password-strength password-error"
                                />
                            </div>
                            {/* Password Strength Progress Bar */}
                            <div className="space-y-2">
                                <Progress value={passwordStrength} className="h-2" />
                                <div className="text-xs text-muted-foreground" id="password-strength">
                                    Password strength: {passwordStrength}%
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500" id="password-error" role="alert">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full md:w-auto"
                            disabled={isLoading || !Object.values(validations).every(Boolean)}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        {/* Social Auth Option */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        {/* Google OAuth Button */}
                        <Button
                            variant="outline"
                            className="w-full md:w-auto"
                            onClick={() => {
                                alert("Google OAuth integration would go here")
                            }}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </>
                ) : (  // If verifying, show verification form
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>We've sent a verification code to {formData.email}</AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                            <Label htmlFor="verification">Verification Code</Label>
                            <Input
                                id="verification"
                                placeholder="Enter 6-digit code"
                                value={verificationCode}
                                onChange={(e) => {
                                    setVerificationCode(e.target.value)
                                    setErrors((prev) => ({ ...prev, verification: null }))
                                }}
                                maxLength={6}
                                className={`text-center text-2xl tracking-widest ${errors.verification ? "border-red-500" : ""}`}
                                aria-invalid={errors.verification ? "true" : "false"}
                                aria-describedby={errors.verification ? "verification-error" : undefined}
                            />
                            {errors.verification ? (
                                <p className="text-sm text-red-500" id="verification-error" role="alert">
                                    {errors.verification}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center">Enter code: 123456 (for demo)</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => setIsVerifying(false)}
                            >
                                Back
                            </Button>
                            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || verificationCode.length !== 6}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Email"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}
