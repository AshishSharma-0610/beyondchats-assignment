import { useEffect } from "react"

export function useFocusTrap(ref) {
    useEffect(() => {
        if (!ref.current) return

        const focusableElements = ref.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        const firstFocusable = focusableElements[0]
        const lastFocusable = focusableElements[focusableElements.length - 1]

        function handleKeyDown(e) {
            if (e.key !== "Tab") return

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus()
                    e.preventDefault()
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus()
                    e.preventDefault()
                }
            }
        }

        ref.current.addEventListener("keydown", handleKeyDown)
        firstFocusable?.focus()

        return () => {
            ref.current?.removeEventListener("keydown", handleKeyDown)
        }
    }, [ref])
}

