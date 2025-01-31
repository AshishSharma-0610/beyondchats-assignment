"use client"

import { createContext, useContext, useState } from "react"

const SetupContext = createContext({})

export function SetupProvider({ children }) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        // User Registration
        name: "",
        email: "",
        password: "",
        isEmailVerified: false,
        verificationCode: "",

        // Organization
        companyName: "",
        companyWebsite: "",
        companyDescription: "",
        scrapedPages: [],

        // Integration
        isIntegrated: false,
        integrationStatus: "pending",
    })

    const updateFormData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }))
    }

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

    return (
        <SetupContext.Provider
            value={{
                step,
                setStep,
                formData,
                updateFormData,
                nextStep,
                prevStep,
            }}
        >
            {children}
        </SetupContext.Provider>
    )
}

export const useSetup = () => useContext(SetupContext)

