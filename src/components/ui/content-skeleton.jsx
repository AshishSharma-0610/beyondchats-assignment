export function ContentSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="space-y-4">
                <div className="h-8 w-3/4 bg-muted rounded-md mx-auto" />
                <div className="h-4 w-1/2 bg-muted rounded-md mx-auto" />
            </div>

            <div className="space-y-4">
                <div className="h-10 bg-muted rounded-md" />
                <div className="h-10 bg-muted rounded-md" />
                <div className="h-24 bg-muted rounded-md" />
            </div>

            <div className="flex gap-4">
                <div className="h-10 w-full bg-muted rounded-md" />
                <div className="h-10 w-full bg-muted rounded-md" />
            </div>
        </div>
    )
}

