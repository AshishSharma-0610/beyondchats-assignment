"use client"

import { SetupProvider } from "./context/setup-context"
import SetupLayout from "./components/setup-layout"
import SetupContent from "./components/setup-content"
import { SkipLink } from "./components/skip-link"
import ErrorBoundary from "./components/error-boundary"
import { ThemeProvider } from "./components/ui/theme-provider"

import { Toaster } from "./components/ui/toaster"
import { MotionWrapper } from "./components/ui/motion-effects"
import { usePullToRefresh } from "./hooks/usePullToRefresh"

function MainContent() {
  const { refreshing, pullDistance } = usePullToRefresh({
    onRefresh: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
  })

  return (
    <MotionWrapper effect="slideUp" className="outline-none focus:ring-2 focus:ring-primary">
      <main id="main-content" tabIndex="-1">
        {refreshing && (
          <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-2 bg-primary text-primary-foreground">
            Refreshing...
          </div>
        )}
        {pullDistance > 0 && (
          <div
            className="fixed top-0 left-0 right-0 h-1 bg-primary"
            style={{ transform: `scaleX(${pullDistance / 150})` }}
          />
        )}
        <SetupContent />
      </main>
    </MotionWrapper>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SetupProvider>
          <SkipLink />
          <SetupLayout>
            <MainContent />
          </SetupLayout>

          <Toaster />
        </SetupProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

