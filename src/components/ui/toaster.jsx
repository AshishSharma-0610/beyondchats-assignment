import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "./button"

const toastTypes = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
}

export function useToast() {
    const [toasts, setToasts] = useState([])

    const addToast = (message, type = "info", duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts((prev) => [...prev, { id, message, type }])

        if (duration) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }

    return { addToast, removeToast, toasts }
}

export function Toaster() {
    const { toasts, removeToast } = useToast()

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`${toastTypes[toast.type]} text-white p-4 rounded-lg shadow-lg min-w-[300px] flex items-center justify-between`}
                    >
                        <span>{toast.message}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeToast(toast.id)}
                            className="text-white hover:text-white/80"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

