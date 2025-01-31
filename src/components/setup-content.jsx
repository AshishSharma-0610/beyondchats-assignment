"use client"

import { useSetup } from "../context/setup-context"
import RegistrationForm from "./registration-form"
import OrganizationSetup from "./organization-setup"
import IntegrationSetup from "./integration-setup"
import { AnimatePresence, motion } from "framer-motion"

export default function SetupContent() {
    const { step } = useSetup()

    const variants = {
        enter: {
            x: 20,
            opacity: 0,
        },
        center: {
            x: 0,
            opacity: 1,
        },
        exit: {
            x: -20,
            opacity: 0,
        },
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.2 }}
            >
                {step === 1 && <RegistrationForm />}
                {step === 2 && <OrganizationSetup />}
                {step === 3 && <IntegrationSetup />}
            </motion.div>
        </AnimatePresence>
    )
}

