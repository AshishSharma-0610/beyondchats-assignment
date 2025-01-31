import { motion } from "framer-motion"


const variants = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    slideIn: {
        initial: { x: -20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 20, opacity: 0 },
    },
    scaleIn: {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 },
    },
    slideUp: {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -20, opacity: 0 },
    },
}

export function MotionWrapper({ children, effect = "fade", className = "", onClick, hover = true, ...props }) {


    const getVariant = () => {
        return variants[`${effect}In`] || variants.fadeIn
    }

    return (
        <motion.div
            {...getVariant()}
            transition={{ duration: 0.2 }}
            className={className}
            onClick={onClick}
            whileHover={hover ? { scale: 1.02 } : undefined}
            onHoverStart={() => hover}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export function MotionButton({ children, onClick, className = "", ...props }) {


    return (
        <motion.button
            className={className}
            onClick={(e) => {
                onClick?.(e)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            {...props}
        >
            {children}
        </motion.button>
    )
}

export function MotionCard({ children, className = "", ...props }) {
    return (
        <motion.div
            className={`rounded-lg border bg-card p-4 shadow-sm ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            {...props}
        >
            {children}
        </motion.div>
    )
}

