"use client"

import { useState } from "react"
import { Building2, RotateCcw, ZoomIn, Layers, Eye, Box, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X, UserPlus, Ambulance } from "lucide-react"
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
  "google-maps": "Google Maps",
  "google-earth": "Street View",
}

type VictimStatus = "DOA" | "REFUSAL" | "TRANSPORTED"

interface Victim {
  id: string
  location: string
  status: VictimStatus
  transportUnit?: string
  time: string
}

// Sample victim data
const initialVictims: Victim[] = [
  { id: "V1", location: "2nd Floor - Bedroom A", status: "TRANSPORTED", transportUnit: "AMB 42", time: "14:26" },
  { id: "V2", location: "2nd Floor - Hallway", status: "REFUSAL", time: "14:28" },
]

interface IntelligencePanelProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  isClosed: boolean
  onClose: () => void
  onOpen: () => void
}

export function IntelligencePanel({ isCollapsed, onToggleCollapse, isClosed, onClose, onOpen }: IntelligencePanelProps) {
  const { selectedSector, mapSource, currentEvent, selectedEventId, displayMode, isFreeRotate, goToSector, setViewMode } = useSimulation()
  const [activeTab, setActiveTab] = useState<"search" | "victims">("search")
  const [victims, setVictims] = useState<Victim[]>(initialVictims)
  const [showAddVictim, setShowAddVictim] = useState(false)
  const [previewZoom, setPreviewZoom] = useState(1)
  const [previewRotation, setPreviewRotation] = useState(-45)
  const [previewMode, setPreviewMode] = useState<"slice" | "xray" | "interior" | null>(null)

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
          collapsedBg: "bg-white/95 border-slate-300",
          tabActive: "bg-cyan-100 border-cyan-300 text-cyan-700",
          tabInactive: "bg-slate-100 border-slate-200 text-slate-500",
          doaBg: "bg-slate-200 text-slate-700",
          refusalBg: "bg-amber-100 text-amber-700",
          transportedBg: "bg-emerald-100 text-emerald-700",
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
          collapsedBg: "bg-black/95 border-green-900",
          tabActive: "bg-green-900/70 border-green-600 text-green-300",
          tabInactive: "bg-green-950/30 border-green-900/50 text-green-600",
          doaBg: "bg-green-950 text-green-500",
          refusalBg: "bg-green-900/50 text-green-400",
          transportedBg: "bg-green-800/50 text-green-300",
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
          collapsedBg: "bg-card/95 border-border",
          tabActive: "bg-accent/20 border-accent/40 text-accent",
          tabInactive: "bg-secondary/30 border-border/50 text-muted-foreground",
          doaBg: "bg-muted text-muted-foreground",
          refusalBg: "bg-hazard/20 text-hazard",
          transportedBg: "bg-safe/20 text-safe",
        }
    }
  }

  const styles = getDisplayModeStyles()
  const viewLabel = isFreeRotate ? "Free Rotate" : sectorLabels[selectedSector]

  const getStatusBadge = (status: VictimStatus) => {
    switch (status) {
      case "DOA":
        return styles.doaBg
      case "REFUSAL":
        return styles.refusalBg
      case "TRANSPORTED":
        return styles.transportedBg
    }
  }

  const victimCounts = {
    total: victims.length,
    doa: victims.filter(v => v.status === "DOA").length,
    refusal: victims.filter(v => v.status === "REFUSAL").length,
    transported: victims.filter(v => v.status === "TRANSPORTED").length,
  }

  // Closed state - just a small tab to reopen
  if (isClosed) {
    return (
      <button
        onClick={onOpen}
        className={cn(
          "h-full w-10 flex flex-col items-center justify-center gap-2 border-l transition-all hover:w-12",
          styles.collapsedBg
        )}
      >
        <ChevronLeft className={cn("w-3 h-3", styles.mutedText)} />
        <Building2 className={cn("w-4 h-4", displayMode === "night-vision" ? "text-green-500" : displayMode === "light" ? "text-cyan-600" : "text-accent")} />
      </button>
    )
  }

  // Collapsed state - slim sidebar
  if (isCollapsed) {
    return (
      <div className={cn(
        "w-12 flex flex-col items-center py-3 border-l transition-all",
        styles.collapsedBg
      )}>
        <button
          onClick={onToggleCollapse}
          className={cn("p-1.5 rounded hover:bg-secondary/50 mb-2", displayMode === "night-vision" && "hover:bg-green-900/50")}
        >
          <ChevronLeft className={cn("w-4 h-4", styles.mutedText)} />
        </button>
        <Building2 className={cn("w-4 h-4 mb-2", displayMode === "night-vision" ? "text-green-500" : displayMode === "light" ? "text-cyan-600" : "text-accent")} />
        <span className={cn("text-[8px] uppercase tracking-wider", styles.mutedText)} style={{ writingMode: "vertical-rl" }}>Intel</span>
      </div>
    )
  }

  return (
    <div className={cn(
      "w-80 flex flex-col overflow-hidden border-l transition-all",
      displayMode === "light" ? styles.containerBg : "",
      displayMode === "night-vision" ? styles.containerBg : "",
      displayMode === "dark" && "tactical-card"
    )}>
      {/* Header */}
      <div className={cn("p-3 border-b flex items-center justify-between", styles.headerBg)}>
        <div className="flex items-center gap-2">
          <Building2 className={cn("w-4 h-4", displayMode === "night-vision" ? "text-green-500" : displayMode === "light" ? "text-cyan-600" : "text-accent")} />
          <span className={cn("text-sm font-semibold uppercase tracking-wide", styles.textColor)}>Structure Intel</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleCollapse}
            className={cn("p-1 rounded hover:bg-secondary/50", displayMode === "night-vision" && "hover:bg-green-900/50")}
          >
            <ChevronRight className={cn("w-4 h-4", styles.mutedText)} />
          </button>
          <button
            onClick={onClose}
            className={cn("p-1 rounded hover:bg-secondary/50", displayMode === "night-vision" && "hover:bg-green-900/50")}
          >
            <X className={cn("w-4 h-4", styles.mutedText)} />
          </button>
        </div>
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

        {/* Search Status / Victims Tabs */}
        <div className="space-y-2">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("search")}
              className={cn(
                "flex-1 px-2 py-1.5 rounded border text-[10px] font-medium uppercase tracking-wide transition-colors",
                activeTab === "search" ? styles.tabActive : styles.tabInactive
              )}
            >
              Search Status
            </button>
            <button
              onClick={() => setActiveTab("victims")}
              className={cn(
                "flex-1 px-2 py-1.5 rounded border text-[10px] font-medium uppercase tracking-wide transition-colors",
                activeTab === "victims" ? styles.tabActive : styles.tabInactive
              )}
            >
              Victims ({victimCounts.total})
            </button>
          </div>

          {activeTab === "search" && (
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
          )}

          {activeTab === "victims" && (
            <div className="space-y-2">
              {/* Status Summary */}
              <div className="grid grid-cols-3 gap-1">
                <div className={cn("p-1.5 rounded text-center", styles.doaBg)}>
                  <span className="text-[8px] font-medium block">DOA</span>
                  <span className="text-sm font-bold">{victimCounts.doa}</span>
                </div>
                <div className={cn("p-1.5 rounded text-center", styles.refusalBg)}>
                  <span className="text-[8px] font-medium block">REFUSAL</span>
                  <span className="text-sm font-bold">{victimCounts.refusal}</span>
                </div>
                <div className={cn("p-1.5 rounded text-center", styles.transportedBg)}>
                  <span className="text-[8px] font-medium block">TRANSPORT</span>
                  <span className="text-sm font-bold">{victimCounts.transported}</span>
                </div>
              </div>

              {/* Victim List */}
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {victims.map((victim) => (
                  <div key={victim.id} className={cn("p-2 rounded border", styles.cardBg)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn("text-[10px] font-bold", styles.textColor)}>{victim.id}</span>
                      <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-medium", getStatusBadge(victim.status))}>
                        {victim.status}
                      </span>
                    </div>
                    <div className={cn("text-[9px]", styles.mutedText)}>{victim.location}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={cn("text-[8px]", styles.mutedText)}>{victim.time}</span>
                      {victim.transportUnit && (
                        <div className="flex items-center gap-1">
                          <Ambulance className={cn("w-3 h-3", styles.safeText)} />
                          <span className={cn("text-[9px] font-medium", styles.safeText)}>{victim.transportUnit}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Victim Button */}
              <Button
                variant="secondary"
                size="sm"
                className={cn(
                  "w-full h-7 text-[10px]",
                  displayMode === "night-vision" && "bg-green-950 border-green-800 text-green-400 hover:bg-green-900/50",
                  displayMode === "light" && "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                )}
                onClick={() => setShowAddVictim(!showAddVictim)}
              >
                <UserPlus className="w-3 h-3 mr-1" />
                Add Victim Record
              </Button>
            </div>
          )}
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
        </div>

        {/* 3D Building Preview */}
        <div className={cn("rounded-lg p-3 border", styles.cardBg)}>
          <div className="flex items-center justify-between mb-3">
            <span className={cn("text-[10px] uppercase tracking-wide", styles.mutedText)}>3D Preview</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-6 w-6 p-0", displayMode === "night-vision" && "hover:bg-green-900/50")}
                onClick={() => setPreviewRotation((r) => r - 15)}
                title="Rotate preview"
              >
                <RotateCcw className={cn("w-3 h-3", displayMode === "night-vision" && "text-green-400")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-6 w-6 p-0", displayMode === "night-vision" && "hover:bg-green-900/50")}
                onClick={() => setPreviewZoom((z) => Math.min(1.6, z + 0.2))}
                title="Zoom preview"
              >
                <ZoomIn className={cn("w-3 h-3", displayMode === "night-vision" && "text-green-400")} />
              </Button>
            </div>
          </div>

          {/* Isometric Building Preview */}
          <div className={cn("relative h-24 rounded border overflow-hidden", styles.previewBg)}>
            <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "400px" }}>
              <div 
                className="relative w-16 h-16"
                style={{ 
                  transform: `rotateX(60deg) rotateZ(${previewRotation}deg) scale(${previewZoom})`,
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Base */}
                <div className={cn(
                  "absolute bottom-0 w-full h-8 border",
                  displayMode === "night-vision" ? "bg-green-950 border-green-800" : 
                  displayMode === "light" ? "bg-slate-300 border-slate-400" : "bg-secondary border-border"
                )} />
                {/* Second Floor */}
                <div className={cn(
                  "absolute bottom-8 w-full h-6 border transition-all duration-500",
                  currentEvent.fireStatus === "knocked" 
                    ? (displayMode === "night-vision" ? "bg-green-800/40 border-green-600/60" : displayMode === "light" ? "bg-emerald-200 border-emerald-400" : "bg-safe/30 border-safe/60")
                    : (displayMode === "night-vision" ? "bg-green-700/50 border-green-500/60" : displayMode === "light" ? "bg-red-200 border-red-400" : "bg-fire/40 border-fire/60")
                )} />
                {/* Roof */}
                <div className={cn(
                  "absolute bottom-[56px] w-full h-2 border",
                  displayMode === "night-vision" ? "bg-green-900 border-green-800" : 
                  displayMode === "light" ? "bg-slate-400 border-slate-500" : "bg-muted border-border"
                )} />
              </div>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex gap-1 mt-2">
            <Button 
              variant={previewMode === "slice" ? "default" : "secondary"}
              size="sm" 
              className={cn(
                "flex-1 h-6 text-[9px]",
                displayMode === "night-vision" && "bg-green-950 border-green-800 text-green-400 hover:bg-green-900/50",
                displayMode === "light" && "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
              )}
              onClick={() => {
                setPreviewMode("slice")
                setViewMode("sector")
                goToSector("overhead")
              }}
            >
              <Layers className="w-3 h-3 mr-1" />
              Slice
            </Button>
            <Button 
              variant={previewMode === "xray" ? "default" : "secondary"}
              size="sm" 
              className={cn(
                "flex-1 h-6 text-[9px]",
                displayMode === "night-vision" && "bg-green-950 border-green-800 text-green-400 hover:bg-green-900/50",
                displayMode === "light" && "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
              )}
              onClick={() => {
                setPreviewMode("xray")
                setViewMode("sector")
                goToSector("interior")
              }}
            >
              <Eye className="w-3 h-3 mr-1" />
              X-Ray
            </Button>
            <Button 
              variant={previewMode === "interior" ? "default" : "secondary"}
              size="sm" 
              className={cn(
                "flex-1 h-6 text-[9px]",
                displayMode === "night-vision" && "bg-green-950 border-green-800 text-green-400 hover:bg-green-900/50",
                displayMode === "light" && "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
              )}
              onClick={() => {
                setPreviewMode("interior")
                setViewMode("sector")
                goToSector("interior")
              }}
            >
              <Box className="w-3 h-3 mr-1" />
              Interior
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
