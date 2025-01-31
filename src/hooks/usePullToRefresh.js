import { useEffect, useState, useCallback } from "react"

export function usePullToRefresh({ onRefresh, threshold = 150, disabled = false }) {
    const [startY, setStartY] = useState(null)
    const [pulling, setPulling] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [pullDistance, setPullDistance] = useState(0)

    const handleTouchStart = useCallback(
        (e) => {
            if (disabled || window.scrollY > 0) return
            setStartY(e.touches[0].clientY)
            setPulling(true)
        },
        [disabled],
    )

    const handleTouchMove = useCallback(
        (e) => {
            if (!startY || !pulling) return

            const currentY = e.touches[0].clientY
            const distance = currentY - startY

            if (distance > 0) {
                setPullDistance(Math.min(distance, threshold * 1.5))
                e.preventDefault()
            }
        },
        [startY, pulling, threshold],
    )

    const handleTouchEnd = useCallback(async () => {
        if (!pulling) return

        setPulling(false)

        if (pullDistance > threshold && !refreshing) {
            setRefreshing(true)
            setPullDistance(0)

            try {
                await onRefresh()
            } finally {
                setRefreshing(false)
            }
        } else {
            setPullDistance(0)
        }
    }, [pulling, pullDistance, threshold, refreshing, onRefresh])

    useEffect(() => {
        if (disabled) return

        document.addEventListener("touchstart", handleTouchStart)
        document.addEventListener("touchmove", handleTouchMove, { passive: false })
        document.addEventListener("touchend", handleTouchEnd)

        return () => {
            document.removeEventListener("touchstart", handleTouchStart)
            document.removeEventListener("touchmove", handleTouchMove)
            document.removeEventListener("touchend", handleTouchEnd)
        }
    }, [disabled, handleTouchStart, handleTouchMove, handleTouchEnd])

    return {
        refreshing,
        pullDistance,
        progress: Math.min((pullDistance / threshold) * 100, 100),
    }
}

