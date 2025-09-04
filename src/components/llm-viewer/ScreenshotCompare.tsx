"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ScreenshotCompareProps {
  screenshotBefore?: string;
  screenshotAfter?: string;
  stepIndex: number;
}

export function ScreenshotCompare({ 
  screenshotBefore, 
  screenshotAfter, 
  stepIndex 
}: ScreenshotCompareProps) {
  const [viewMode, setViewMode] = useState<"before" | "after" | "slider">("slider");
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== "slider") return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  // Placeholder images for demonstration
  const beforeImage = screenshotBefore || `https://via.placeholder.com/375x812/1a1a2e/ffffff?text=Before+Step+${stepIndex}`;
  const afterImage = screenshotAfter || `https://via.placeholder.com/375x812/0f3460/ffffff?text=After+Step+${stepIndex}`;

  return (
    <div className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--brand-ink)]">Screenshot Comparison</h3>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "before" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("before")}
            className="h-7 px-2 text-xs rounded-[var(--r-ctl)]"
          >
            Before
          </Button>
          <Button
            variant={viewMode === "slider" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("slider")}
            className="h-7 px-2 text-xs rounded-[var(--r-ctl)]"
          >
            Compare
          </Button>
          <Button
            variant={viewMode === "after" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("after")}
            className="h-7 px-2 text-xs rounded-[var(--r-ctl)]"
          >
            After
          </Button>
        </div>
      </div>

      <div className="relative w-full aspect-[9/16] max-h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        {viewMode === "slider" ? (
          <div 
            className="relative w-full h-full cursor-ew-resize"
            onMouseMove={handleSliderMove}
          >
            {/* After image (background) */}
            <div className="absolute inset-0">
              <img
                src={afterImage}
                alt="After"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Before image (foreground with clip) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={beforeImage}
                alt="Before"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Slider line */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-[var(--brand-primary-500)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--brand-primary-500)] rounded-full flex items-center justify-center">
                <ChevronLeft className="h-3 w-3 text-white absolute -left-0.5" />
                <ChevronRight className="h-3 w-3 text-white absolute -right-0.5" />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              Before
            </div>
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              After
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={viewMode === "before" ? beforeImage : afterImage}
              alt={viewMode === "before" ? "Before" : "After"}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded capitalize">
              {viewMode}
            </div>
          </div>
        )}

        {/* Expand button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-2 right-2 h-7 w-7 p-0 bg-black/50 hover:bg-black/70 text-white"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Step {stepIndex}</span>
        <span>Tap/drag to compare</span>
      </div>
    </div>
  );
}