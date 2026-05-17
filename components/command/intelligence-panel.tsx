"use client"

import { Building2, RotateCcw, ZoomIn, Layers, Eye, Box, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSimulation, SectorView } from "./simulation-context"
import { cn } from "@/lib/utils"

const sectorLabels: Record<SectorView, string> = {
  alpha: "Alpha Side",
  bravo: "Bravo Side",
  charlie: "Charlie Side",
  delta: "Delta Side",
  roof: "Roof View",
  overhead: "Overhead View",
  interior: "Interior Slice",
}

const mapSourceLabels = {
  tactical: "Tactical Grid",
  satellite: "Satellite View",
  "google-maps": "Street Map",
  "google-earth": "Overview Map",
}

export function IntelligencePanel() {
  const { selectedSector, mapSource, currentEvent, selectedEventId, displayMode, isFreeRotate } = useSimulation()

  const structureData = [
    { label: "Building Type", value: "Brick Ordinary" },
    { label: "Occupancy", value: "Mixed Use (Commercial/Residential)" },
    { label: "Dimensions", value: "25' × 50'" },
    { label: "Floors", value: "2 Stories + Basement" },
    { label: "Roof Type", value: "Hip Roof - Asphalt Shingle" },
    { label: "Fire Location", value: "2nd Floor Alpha Side" },
    { label: "Exposure Risk", value: "Bravo/Delta Adjacent Units" },
    { label: "Water Supply", value: "Hydrant - S Fairfield Ave" },
  ]

  const getDisplayModeStyles = () => {
    switch (displayMode) {
      case "light":
        return {
          containerBg: "bg-white/95 border-slate-300",
          headerBg: "border-slate-300",
          textColor: "text-slate-900",
          mutedText: "text-slate-600",
          cardBg: "bg-slate-100/80 border-slate-200",
          accentBg: "bg-cyan-100/80 border-cyan-300",
          accentText: "text-cyan-700",
          secondaryBg: "bg-slate-50 border-slate-200",
          previewBg: "bg-slate-100 border-slate-300",
          fireBg: "bg-red-100 border-red-300",
          fireText: "text-red-700",
          safeBg: "bg-emerald-100 border-emerald-300",
          safeText: "text-emerald-700",
          hazardBg: "bg-amber-100 border-amber-300",
          hazardText: "text-amber-700",
        }
      case "night-vision":
        return {
          containerBg: "bg-black/95 border-green-900",
          headerBg: "border-green-900",
          textColor: "text-green-400",
          mutedText: "text-green-600",
          cardBg: "bg-green-950/50 border-green-900/50",
          accentBg: "bg-green-900/50 border-green-700/50",
          accentText: "text-green-300",
          secondaryBg: "bg-green-950/30 border-green-900/30",
          previewBg: "bg-black border-green-900",
          fireBg: "bg-green-800/30 border-green-600/50",
          fireText: "text-green-400",
          safeBg: "bg-green-900/50 border-green-500/50",
          safeText: "text-green-300",
          hazardBg: "bg-green-800/40 border-green-500/40",
          hazardText: "text-green-400",
        }
      default:
        return {
          containerBg: "tactical-card",
          headerBg: "border-border",
          textColor: "text-foreground",
          mutedText: "text-muted-foreground",
          cardBg: "bg-secondary/50 border-border",
          accentBg: "bg-accent/10 border-accent/30",
          accentText: "text-accent",
          secondaryBg: "bg-secondary/50 border-border/50",
          previewBg: "bg-background/50 border-border",
          fireBg: "bg-fire/10 border-fire/30",
          fireText: "text-fire",
          safeBg: "bg-safe/10 border-safe/30",
          safeText: "text-safe",
          hazardBg: "bg-hazard/10 border-hazard/30",
          hazardText: "text-hazard",
        }
    }
  }

  const styles = getDisplayModeStyles()
  const viewLabel = isFreeRotate ? "Free Rotate" : sectorLabels[selectedSector]

  return (
    <div className={cn(
      "w-72 flex flex-col overflow-hidden border",
      displayMode === "light" ? styles.containerBg : "",
      displayMode === "night-vision" ? styles.containerBg : "",
      displayMode === "dark" && "tactical-card"
    )}>
      {/* Header */}
      <div className={cn("p-3 border-b flex items-center gap-2", styles.headerBg)}>
        <Building2 className={cn("w-4 h-4", displayMode === "night-vision" ? "text-green-500" : displayMode === "light" ? "text-cyan-600" : "text-accent")} />
        <span className={cn("text-sm font-semibold uppercase tracking-wide", styles.textColor)}>Structure Intel</span>
      </div>

      {/* Structure Data */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Current View Status */}
        <div className={cn("p-2 rounded-lg border", styles.accentBg)}>
          <div className="flex justify-between items-center mb-2">
            <span className={cn("text-[10px] uppercase tracking-wide", styles.mutedText)}>Current View</span>
            <span className={cn("text-xs font-semibold", styles.accentText)}>{viewLabel}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className={cn("text-[10px] uppercase tracking-wide", styles.mutedText)}>Map Source</span>
            <span className={cn("text-xs font-medium", styles.textColor)}>{mapSourceLabels[mapSource]}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={cn("text-[10px] uppercase tracking-wide", styles.mutedText)}>Timeline Event</span>
            <span className={cn("text-xs font-medium", styles.textColor)}>{currentEvent.label}</span>
          </div>
        </div>

        {/* Incident Notes */}
        <div className={cn("p-2 rounded-lg border", styles.cardBg)}>
          <span className={cn("text-[10px] uppercase tracking-wide block mb-1", styles.mutedText)}>Incident Notes</span>
          <p className={cn("text-xs", styles.textColor)}>{currentEvent.description}</p>
        </div>

        {/* Data Cards */}
        <div className="space-y-2">
          <span className={cn("text-[10px] uppercase tracking-wide", styles.mutedText)}>Building Data</span>
          {structureData.map((item) => (
            <div key={item.label} className={cn("flex justify-between items-center py-1.5 px-2 rounded border", styles.secondaryBg)}>
              <span className={cn("text-[10px] uppercase tracking-wide", styles.mutedText)}>{item.label}</span>
              <span className={cn("text-xs font-medium text-right", styles.textColor)}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* 3D Building Preview */}
        <div className={cn("rounded-lg p-3 border", styles.cardBg)}>
          <div className="flex items-center justify-between mb-3">
            <span className={cn("text-[10px] uppercase tracking-wide", styles.mutedText)}>3D Preview</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className={cn("h-6 w-6 p-0", displayMode === "night-vision" && "hover:bg-green-900/50")}>
                <RotateCcw className={cn("w-3 h-3", displayMode === "night-vision" && "text-green-400")} />
              </Button>
              <Button variant="ghost" size="sm" className={cn("h-6 w-6 p-0", displayMode === "night-vision" && "hover:bg-green-900/50")}>
                <ZoomIn className={cn("w-3 h-3", displayMode === "night-vision" && "text-green-400")} />
              </Button>
            </div>
          </div>

          {/* Isometric Building Preview */}
          <div className={cn("relative h-32 rounded border overflow-hidden", styles.previewBg)}>
            <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "400px" }}>
              <div 
                className="relative w-20 h-20"
                style={{ 
                  transform: "rotateX(60deg) rotateZ(-45deg)",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Base */}
                <div className={cn(
                  "absolute bottom-0 w-full h-10 border",
                  displayMode === "night-vision" ? "bg-green-950 border-green-800" : 
                  displayMode === "light" ? "bg-slate-300 border-slate-400" : "bg-secondary border-border"
                )} />
                {/* Second Floor */}
                <div className={cn(
                  "absolute bottom-10 w-full h-8 border transition-all duration-500",
                  currentEvent.fireStatus === "knocked" 
                    ? (displayMode === "night-vision" ? "bg-green-800/40 border-green-600/60" : displayMode === "light" ? "bg-emerald-200 border-emerald-400" : "bg-safe/30 border-safe/60")
                    : (displayMode === "night-vision" ? "bg-green-700/50 border-green-500/60" : displayMode === "light" ? "bg-red-200 border-red-400" : "bg-fire/40 border-fire/60")
                )}
                  style={{ 
                    boxShadow: currentEvent.fireStatus === "knocked"
                      ? (displayMode === "night-vision" ? "inset 0 0 15px rgba(0, 150, 0, 0.3)" : "inset 0 0 15px rgba(100, 200, 100, 0.3)")
                      : (displayMode === "night-vision" ? "inset 0 0 20px rgba(0, 200, 0, 0.4)" : "inset 0 0 20px rgba(255, 100, 50, 0.4)")
                  }}
                />
                {/* Roof */}
                <div className={cn(
                  "absolute bottom-[72px] w-full h-2 border",
                  displayMode === "night-vision" ? "bg-green-900 border-green-800" : 
                  displayMode === "light" ? "bg-slate-400 border-slate-500" : "bg-muted border-border"
                )} />
              </div>
            </div>

            {/* Floor Indicator */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              <button className={cn(
                "w-5 h-5 flex items-center justify-center rounded border transition-colors",
                displayMode === "night-vision" ? "bg-green-950 border-green-800 hover:bg-green-900/50" : 
                displayMode === "light" ? "bg-white border-slate-300 hover:bg-slate-100" : "bg-secondary border-border hover:bg-accent/20"
              )}>
                <ChevronUp className={cn("w-3 h-3", styles.mutedText)} />
              </button>
              <div className={cn(
                "px-1.5 py-0.5 border rounded text-center transition-all duration-500",
                currentEvent.fireStatus === "knocked" 
                  ? styles.safeBg
                  : styles.fireBg
              )}>
                <span className={cn(
                  "text-[8px] font-bold",
                  currentEvent.fireStatus === "knocked" ? styles.safeText : styles.fireText
                )}>F2</span>
              </div>
              <div className={cn("px-1.5 py-0.5 rounded border text-center", styles.secondaryBg)}>
                <span className={cn("text-[8px]", styles.mutedText)}>F1</span>
              </div>
              <button className={cn(
                "w-5 h-5 flex items-center justify-center rounded border transition-colors",
                displayMode === "night-vision" ? "bg-green-950 border-green-800 hover:bg-green-900/50" : 
                displayMode === "light" ? "bg-white border-slate-300 hover:bg-slate-100" : "bg-secondary border-border hover:bg-accent/20"
              )}>
                <ChevronDown className={cn("w-3 h-3", styles.mutedText)} />
              </button>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex gap-1 mt-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className={cn(
                "flex-1 h-7 text-[10px]",
                displayMode === "night-vision" && "bg-green-950 border-green-800 text-green-400 hover:bg-green-900/50",
                displayMode === "light" && "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
              )}
            >
              <Layers className="w-3 h-3 mr-1" />
              Slice
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className={cn(
                "flex-1 h-7 text-[10px]",
                displayMode === "night-vision" && "bg-green-950 border-green-800 text-green-400 hover:bg-green-900/50",
                displayMode === "light" && "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
              )}
            >
              <Eye className="w-3 h-3 mr-1" />
              X-Ray
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className={cn(
                "flex-1 h-7 text-[10px]",
                displayMode === "night-vision" && "bg-green-950 border-green-800 text-green-400 hover:bg-green-900/50",
                displayMode === "light" && "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
              )}
            >
              <Box className="w-3 h-3 mr-1" />
              Interior
            </Button>
          </div>
        </div>

        {/* Hazard Alerts */}
        <div className="space-y-2">
          <span className={cn("text-[10px] uppercase tracking-wide", styles.mutedText)}>Active Hazards</span>
          <div className={cn(
            "p-2 rounded border transition-all duration-500",
            currentEvent.fireStatus === "knocked" ? styles.safeBg : styles.fireBg
          )}>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                currentEvent.fireStatus === "knocked" 
                  ? (displayMode === "night-vision" ? "bg-green-400" : displayMode === "light" ? "bg-emerald-500" : "bg-safe")
                  : (displayMode === "night-vision" ? "bg-green-500 animate-pulse" : displayMode === "light" ? "bg-red-500 animate-pulse" : "bg-fire animate-pulse")
              )} />
              <span className={cn(
                "text-[11px] font-medium",
                currentEvent.fireStatus === "knocked" ? styles.safeText : styles.fireText
              )}>
                {currentEvent.fireStatus === "knocked" ? "Fire Knocked Down" : "Fire - 2nd Floor Charlie"}
              </span>
            </div>
          </div>
          <div className={cn("p-2 rounded border", styles.hazardBg)}>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                displayMode === "night-vision" ? "bg-green-500" : displayMode === "light" ? "bg-amber-500" : "bg-hazard"
              )} />
              <span className={cn("text-[11px] font-medium", styles.hazardText)}>Collapse Risk - Front Porch</span>
            </div>
          </div>
          <div className={cn("p-2 rounded border", styles.cardBg)}>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                displayMode === "night-vision" ? "bg-green-400" : displayMode === "light" ? "bg-emerald-500" : "bg-safe"
              )} />
              <span className={cn("text-[11px]", styles.mutedText)}>Utilities - Gas Secured</span>
            </div>
          </div>
        </div>

        {/* Search Status */}
        <div className="space-y-2">
          <span className={cn("text-[10px] uppercase tracking-wide", styles.mutedText)}>Search Status</span>
          <div className="grid grid-cols-2 gap-1.5">
            <div className={cn(
              "p-1.5 rounded border text-center transition-all duration-500",
              selectedEventId >= 8 ? styles.safeBg : styles.hazardBg
            )}>
              <span className={cn(
                "text-[9px] font-medium block",
                selectedEventId >= 8 ? styles.safeText : styles.hazardText
              )}>F2 Primary</span>
              <span className={cn(
                "text-[8px]",
                selectedEventId >= 8 ? styles.safeText : styles.hazardText
              )} style={{ opacity: 0.7 }}>{selectedEventId >= 8 ? "COMPLETE" : "IN PROGRESS"}</span>
            </div>
            <div className={cn(
              "p-1.5 rounded border text-center transition-all duration-500",
              selectedEventId >= 7 ? styles.safeBg : styles.secondaryBg
            )}>
              <span className={cn(
                "text-[9px] font-medium block",
                selectedEventId >= 7 ? styles.safeText : styles.mutedText
              )}>F1 Primary</span>
              <span className={cn(
                "text-[8px]",
                selectedEventId >= 7 ? styles.safeText : styles.mutedText
              )} style={{ opacity: 0.7 }}>{selectedEventId >= 7 ? "COMPLETE" : "PENDING"}</span>
            </div>
            <div className={cn("p-1.5 rounded border text-center", styles.secondaryBg)}>
              <span className={cn("text-[9px] font-medium block", styles.mutedText)}>F2 Secondary</span>
              <span className={cn("text-[8px]", styles.mutedText)} style={{ opacity: 0.7 }}>PENDING</span>
            </div>
            <div className={cn("p-1.5 rounded border text-center", styles.secondaryBg)}>
              <span className={cn("text-[9px] font-medium block", styles.mutedText)}>Basement</span>
              <span className={cn("text-[8px]", styles.mutedText)} style={{ opacity: 0.7 }}>N/A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
