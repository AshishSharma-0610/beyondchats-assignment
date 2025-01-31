"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sun, Moon } from "lucide-react";
import { useSetup } from "../context/setup-context";

export default function SetupLayout({ children }) {
  const [isDark, setIsDark] = useState(false);
  const { step } = useSetup();

  useEffect(() => {
    // Check localStorage to persist theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className={`min-h-screen bg-background ${isDark ? "dark" : ""}`}>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <span className="text-xl font-bold">BeyondChats</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Registration</span>
            <span>Organization</span>
            <span>Integration</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">{children}</div>
      </div>
    </div>
  );
}


