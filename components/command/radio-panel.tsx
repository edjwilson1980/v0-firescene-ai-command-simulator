"use client"

import { useState } from "react"
import { Radio, Truck, Users, Droplets, AlertTriangle, Shield, Search, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useSimulation, SectorView } from "./simulation-context"
import { cn } from "@/lib/utils"

interface RadioMessage {
  id: string
  timestamp: string
  unit: string
  message: string
  type: "engine" | "truck" | "ems" | "command" | "hazard" | "search"
}

const radioMessages: RadioMessage[] = [
  { id: "1", timestamp: "14:32", unit: "Command", message: "RIT established, Truck 9 standing by Marquette and Fairfield", type: "command" },
  { id: "2", timestamp: "14:28", unit: "Engine 78", message: "Water on the fire, knockdown in progress second floor", type: "engine" },
  { id: "3", timestamp: "14:24", unit: "Truck 23", message: "Primary search all clear, 2nd floor 2824 W Marquette", type: "search" },
  { id: "4", timestamp: "14:20", unit: "Truck 23", message: "Opening hip roof for vertical ventilation", type: "truck" },
  { id: "5", timestamp: "14:16", unit: "Engine 78", message: "Heavy smoke pushing from 2nd floor front windows, brick two-flat", type: "hazard" },
  { id: "6", timestamp: "14:12", unit: "Engine 78", message: "Stretching 1¾ inch line through front door Alpha side", type: "engine" },
  { id: "7", timestamp: "14:08", unit: "Battalion 18", message: "Establishing Marquette Command, Alpha-Bravo corner", type: "command" },
  { id: "8", timestamp: "14:04", unit: "Engine 78", message: "On scene 2824 W Marquette, 2-story brick ordinary, smoke from 2nd floor", type: "engine" },
  { id: "9", timestamp: "14:00", unit: "Dispatch", message: "Structure fire, 2824 W Marquette, Chicago Lawn, caller reports fire 2nd floor", type: "command" },
  { id: "10", timestamp: "14:06", unit: "Ambulance 42", message: "Ambulance 42 on scene, staging Alpha side", type: "ems" },
  { id: "11", timestamp: "14:10", unit: "Truck 9", message: "Truck 9 on scene, RIT assignment", type: "truck" },
  { id: "12", timestamp: "14:14", unit: "Engine 84", message: "Engine 84 on scene, water supply", type: "engine" },
]

const sectorLabels: Record<SectorView, string> = {
  "alpha": "Alpha Side",
  "bravo": "Bravo Side",
  "charlie": "Charlie Side",
  "delta": "Delta Side",
  "roof": "Roof View",
  "overhead": "Overhead View",
  "interior": "Interior Slice",
}

const sectors: SectorView[] = ["alpha", "bravo", "charlie", "delta", "roof", "overhead", "interior"]

const getIcon = (type: RadioMessage["type"]) => {
  switch (type) {
    case "engine": return <Droplets className="w-3.5 h-3.5" />
    case "truck": return <Truck className="w-3.5 h-3.5" />
    case "command": return <Radio className="w-3.5 h-3.5" />
    case "hazard": return <AlertTriangle className="w-3.5 h-3.5" />
    case "search": return <Search className="w-3.5 h-3.5" />
    case "ems": return <Users className="w-3.5 h-3.5" />
    default: return <Radio className="w-3.5 h-3.5" />
  }
}

const getTypeColor = (type: RadioMessage["type"], displayMode: string) => {
  if (displayMode === "night-vision") {
    return "text-green-400 border-green-700/50 bg-green-900/30"
  }
  if (displayMode === "light") {
    switch (type) {
      case "engine": return "text-blue-700 border-blue-300 bg-blue-100"
      case "truck": return "text-amber-700 border-amber-300 bg-amber-100"
      case "command": return "text-purple-700 border-purple-300 bg-purple-100"
      case "hazard": return "text-red-700 border-red-300 bg-red-100"
      case "search": return "text-emerald-700 border-emerald-300 bg-emerald-100"
      case "ems": return "text-cyan-700 border-cyan-300 bg-cyan-100"
      default: return "text-slate-700 border-slate-300 bg-slate-100"
    }
  }
  switch (type) {
    case "engine": return "text-water border-water/30 bg-water/10"
    case "truck": return "text-hazard border-hazard/30 bg-hazard/10"
    case "command": return "text-radio border-radio/30 bg-radio/10"
    case "hazard": return "text-fire border-fire/30 bg-fire/10"
    case "search": return "text-safe border-safe/30 bg-safe/10"
    case "ems": return "text-accent border-accent/30 bg-accent/10"
    default: return "text-muted-foreground border-border bg-secondary"
  }
}

interface RadioPanelProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  isClosed: boolean
  onClose: () => void
  onOpen: () => void
}

export function RadioPanel({ isCollapsed, onToggleCollapse, isClosed, onClose, onOpen }: RadioPanelProps) {
  const { displayMode, selectedSector, goToSector, isFreeRotate, resetViewport } = useSimulation()

  const getDisplayModeStyles = () => {
    switch (displayMode) {
      case "light":
        return {
          containerBg: "bg-white/95 border-slate-300",
          headerBg: "border-slate-300",
          textColor: "text-slate-900",
          mutedText: "text-slate-600",
          cardBg: "bg-slate-100/80 border-slate-200",
          activeBg: "bg-white border-purple-300",
          liveColor: "text-red-600",
          liveBg: "bg-red-600",
          collapsedBg: "bg-white/95 border-slate-300",
        }
      case "night-vision":
        return {
          containerBg: "bg-black/95 border-green-900",
          headerBg: "border-green-900",
          textColor: "text-green-400",
          mutedText: "text-green-600",
          cardBg: "bg-green-950/50 border-green-900/50",
          activeBg: "bg-green-900/50 border-green-600/50",
          liveColor: "text-green-400",
          liveBg: "bg-green-500",
          collapsedBg: "bg-black/95 border-green-900",
        }
      default:
        return {
          containerBg: "tactical-card",
          headerBg: "border-border",
          textColor: "text-foreground",
          mutedText: "text-muted-foreground",
          cardBg: "bg-secondary/50 border-border/50",
          activeBg: "tactical-glass border-radio/40 glow-radio",
          liveColor: "text-live",
          liveBg: "bg-live",
          collapsedBg: "bg-card/95 border-border",
        }
    }
  }

  const styles = getDisplayModeStyles()

  // Closed state - just a small tab to reopen
  if (isClosed) {
    return (
      <button
        onClick={onOpen}
        className={cn(
          "h-full w-10 flex flex-col items-center justify-center gap-2 border-r transition-all hover:w-12",
          styles.collapsedBg
        )}
      >
        <Radio className={cn("w-4 h-4", displayMode === "night-vision" ? "text-green-500" : displayMode === "light" ? "text-purple-600" : "text-radio")} />
        <ChevronRight className={cn("w-3 h-3", styles.mutedText)} />
      </button>
    )
  }

  // Collapsed state - slim sidebar
  if (isCollapsed) {
    return (
      <div className={cn(
        "w-12 flex flex-col items-center py-3 border-r transition-all",
        styles.collapsedBg
      )}>
        <button
          onClick={onToggleCollapse}
          className={cn("p-1.5 rounded hover:bg-secondary/50 mb-2", displayMode === "night-vision" && "hover:bg-green-900/50")}
        >
          <ChevronRight className={cn("w-4 h-4", styles.mutedText)} />
        </button>
        <Radio className={cn("w-4 h-4 mb-2", displayMode === "night-vision" ? "text-green-500" : displayMode === "light" ? "text-purple-600" : "text-radio")} />
        <div className={cn("w-2 h-2 rounded-full animate-pulse mb-2", styles.liveBg)} />
        <span className={cn("text-[8px] uppercase tracking-wider", styles.mutedText)} style={{ writingMode: "vertical-rl" }}>Radio</span>
      </div>
    )
  }

  return (
    <div className={cn(
      "w-72 flex flex-col overflow-hidden border-r transition-all",
      displayMode === "light" ? styles.containerBg : "",
      displayMode === "night-vision" ? styles.containerBg : "",
      displayMode === "dark" && "tactical-card"
    )}>
      {/* Header */}
      <div className={cn("p-3 border-b flex items-center justify-between", styles.headerBg)}>
        <div className="flex items-center gap-2">
          <Radio className={cn("w-4 h-4", displayMode === "night-vision" ? "text-green-500" : displayMode === "light" ? "text-purple-600" : "text-radio")} />
          <span className={cn("text-sm font-semibold uppercase tracking-wide", styles.textColor)}>Radio Traffic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", styles.liveBg)} />
            <span className={cn("text-[10px] uppercase font-medium", styles.liveColor)}>Live</span>
          </div>
          <button
            onClick={onToggleCollapse}
            className={cn("p-1 rounded hover:bg-secondary/50", displayMode === "night-vision" && "hover:bg-green-900/50")}
          >
            <ChevronLeft className={cn("w-4 h-4", styles.mutedText)} />
          </button>
          <button
            onClick={onClose}
            className={cn("p-1 rounded hover:bg-secondary/50", displayMode === "night-vision" && "hover:bg-green-900/50")}
          >
            <X className={cn("w-4 h-4", styles.mutedText)} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {radioMessages.map((msg, index) => (
          <div
            key={msg.id}
            className={cn(
              "p-2.5 rounded-lg border",
              index === 0 ? styles.activeBg : styles.cardBg
            )}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className={cn("flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium border", getTypeColor(msg.type, displayMode))}>
                {getIcon(msg.type)}
                <span>{msg.unit}</span>
              </div>
              <span className={cn("text-[10px] font-mono", styles.mutedText)}>{msg.timestamp}</span>
            </div>
            <p className={cn("text-xs leading-relaxed", index === 0 ? styles.textColor : styles.mutedText)}>
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      {/* Select View Section */}
      <div className={cn("border-t p-2", styles.headerBg)}>
        <div className={cn("text-[9px] uppercase tracking-wider font-semibold mb-2", styles.mutedText)}>Select View</div>
        <div className="flex flex-col gap-1">
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => goToSector(sector)}
              className={cn(
                "px-2 py-1.5 rounded text-[9px] font-medium transition-all duration-200 text-left",
                selectedSector === sector && !isFreeRotate
                  ? "bg-accent text-accent-foreground"
                  : cn(styles.mutedText, "hover:bg-secondary hover:text-foreground")
              )}
            >
              {sectorLabels[sector]}
            </button>
          ))}
        </div>
        {isFreeRotate && (
          <button
            onClick={resetViewport}
            className="mt-2 w-full px-2 py-1 rounded text-[8px] font-medium bg-fire/20 text-fire border border-fire/30 hover:bg-fire/30 transition-all"
          >
            Reset to Alpha
          </button>
        )}
      </div>

      {/* Footer */}
      <div className={cn("p-2 border-t", styles.headerBg)}>
        <div className={cn("flex items-center justify-between text-[10px]", styles.mutedText)}>
          <span>Channel: MAIN-TAC 1</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Encrypted
          </span>
        </div>
      </div>
    </div>
  )
}

// Export the radio messages for PAR check
export { radioMessages }
