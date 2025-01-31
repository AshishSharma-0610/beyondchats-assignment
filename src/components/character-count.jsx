export function CharacterCount({ current, max, className = "" }) {
    const percentage = (current / max) * 100
    const isWarning = percentage >= 80
    const isError = percentage >= 90

    return (
        <div className={`text-xs ${className}`}>
            <span className={`${isError ? "text-destructive" : isWarning ? "text-yellow-500" : "text-muted-foreground"}`}>
                {current}/{max} characters
            </span>
            <div className="h-1 w-full bg-muted mt-1 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all ${isError ? "bg-destructive" : isWarning ? "bg-yellow-500" : "bg-primary"}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

