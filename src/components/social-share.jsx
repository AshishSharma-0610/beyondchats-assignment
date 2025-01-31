export function SocialShare({ url, title }) {
    const shareData = {
        title: "BeyondChats Integration Complete!",
        text: "I just set up my chatbot with BeyondChats!",
        url: url || window.location.href,
    }

    const handleShare = async (platform) => {
        try {
            if (navigator.share && platform === "native") {
                await navigator.share(shareData)
                return
            }

            const urls = {
                twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
                linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
            }

            window.open(urls[platform], "_blank", "noopener,noreferrer")
        } catch (error) {
            console.error("Error sharing:", error)
        }
    }

    return (
        <div className="flex justify-center gap-4">
            <button
                onClick={() => handleShare("twitter")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Share on Twitter"
            >
                Share on Twitter
            </button>
            <button
                onClick={() => handleShare("linkedin")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Share on LinkedIn"
            >
                Share on LinkedIn
            </button>
            {navigator.share && (
                <button
                    onClick={() => handleShare("native")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Share"
                >
                    Share...
                </button>
            )}
        </div>
    )
}

