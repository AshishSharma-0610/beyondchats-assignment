import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function BottomSheet({ isOpen, onClose, children }) {
    const sheetRef = useRef(null)
    const [startY, setStartY] = useState(0)
    const [currentY, setCurrentY] = useState(0)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sheetRef.current && !sheetRef.current.contains(event.target)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    const handleTouchStart = (e) => {
        setStartY(e.touches[0].clientY)
        setIsDragging(true)
    }

    const handleTouchMove = (e) => {
        if (isDragging) {
            const deltaY = e.touches[0].clientY - startY
            if (deltaY > 0) {
                setCurrentY(deltaY)
            }
        }
    }

    const handleTouchEnd = () => {
        setIsDragging(false)
        if (currentY > 100) {
            onClose()
        }
        setCurrentY(0)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        ref={sheetRef}
                        initial={{ y: "100%" }}
                        animate={{ y: currentY > 0 ? currentY : 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed bottom-0 left-0 right-0 bg-background rounded-t-xl z-50 overflow-hidden"
                        style={{ touchAction: "none" }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto my-2" />
                        <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

