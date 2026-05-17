"use client"

import { Flame, Radio, Wifi, Wind, Activity, MapPin, Clock, Sun, Moon, Eye } from "lucide-react"
import { useSimulation, DisplayMode } from "./simulation-context"
import { cn } from "@/lib/utils"

const displayModes: { id: DisplayMode; label: string; icon: typeof Sun; description: string }[] = [
  { id: "dark", label: "Dark", icon: Moon, description: "Night Command" },
  { id: "light", label: "Light", icon: Sun, description: "Daylight Use" },
  { id: "night-vision", label: "NV", icon: Eye, description: "Night Vision" },
]

export function HeaderBar() {
  const { displayMode, setDisplayMode } = useSimulation()

  const getDisplayModeStyles = () => {
    switch (displayMode) {
      case "light":
        return {
          containerBg: "bg-white/95 border-slate-300",
          textColor: "text-slate-900",
          mutedText: "text-slate-500",
          logoBg: "bg-red-100 border-red-300",
          logoIcon: "text-red-600",
          statusBg: "bg-red-100 border-red-300",
          statusText: "text-red-700",
          timerBg: "bg-slate-100 border-slate-300",
          timerIcon: "text-cyan-600",
          toggleBg: "bg-slate-100 border-slate-300",
          toggleActive: "bg-cyan-600 text-white",
          toggleInactive: "text-slate-500 hover:bg-slate-200 hover:text-slate-700",
          liveBg: "bg-red-100 border-red-300",
          liveText: "text-red-600",
          liveDot: "bg-red-500",
          syncBg: "bg-emerald-100 border-emerald-300",
          syncText: "text-emerald-600",
        }
      case "night-vision":
        return {
          containerBg: "bg-black/95 border-green-900",
          textColor: "text-green-400",
          mutedText: "text-green-600",
          logoBg: "bg-green-900/50 border-green-700",
          logoIcon: "text-green-500",
          statusBg: "bg-green-900/50 border-green-600",
          statusText: "text-green-400",
          timerBg: "bg-green-950 border-green-800",
          timerIcon: "text-green-500",
          toggleBg: "bg-green-950 border-green-800",
          toggleActive: "bg-green-700 text-green-200",
          toggleInactive: "text-green-600 hover:bg-green-900/50 hover:text-green-400",
          liveBg: "bg-green-900/50 border-green-700",
          liveText: "text-green-400",
          liveDot: "bg-green-500",
          syncBg: "bg-green-900/50 border-green-700",
          syncText: "text-green-400",
        }
      default:
        return {
          containerBg: "bg-card/90 border-border",
          textColor: "text-foreground",
          mutedText: "text-muted-foreground",
          logoBg: "bg-primary/20 border-primary/40",
          logoIcon: "text-primary",
          statusBg: "bg-fire/20 border-fire/40 glow-fire",
          statusText: "text-fire",
          timerBg: "bg-secondary border-border",
          timerIcon: "text-accent",
          toggleBg: "bg-secondary/80 border-border",
          toggleActive: "bg-accent text-accent-foreground",
          toggleInactive: "text-muted-foreground hover:bg-secondary hover:text-foreground",
          liveBg: "bg-live/10 border-live/30",
          liveText: "text-live",
          liveDot: "bg-live glow-live",
          syncBg: "bg-sync/10 border-sync/30",
          syncText: "text-sync",
        }
    }
  }

  const styles = getDisplayModeStyles()

  return (
    <header className={cn("h-14 flex items-center justify-between px-4 backdrop-blur-sm border-b", styles.containerBg)}>
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center", styles.logoBg)}>
            <Flame className={cn("w-5 h-5", styles.logoIcon)} />
          </div>
          <div className="flex flex-col">
            <span className={cn("text-sm font-semibold tracking-tight", styles.textColor)}>FireScene AI</span>
            <span className={cn("text-[10px] uppercase tracking-widest", styles.mutedText)}>Command Simulator</span>
          </div>
        </div>
      </div>

      {/* Incident Status */}
      <div className="flex items-center gap-6">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <div className={cn("px-3 py-1 rounded border", styles.statusBg)}>
            <span className={cn("text-xs font-bold uppercase tracking-wider", styles.statusText)}>Working Fire</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className={cn("w-4 h-4", styles.mutedText)} />
          <span className={cn("font-medium", styles.textColor)}>1234 S Halsted St, Chicago, IL</span>
        </div>

        {/* Timer */}
        <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded border", styles.timerBg)}>
          <Clock className={cn("w-4 h-4", styles.timerIcon)} />
          <span className={cn("text-sm font-mono font-semibold", styles.textColor)}>00:14:32</span>
        </div>
      </div>

      {/* Display Mode Selector and Status Indicators */}
      <div className="flex items-center gap-4">
        {/* Display Mode Toggle */}
        <div className={cn("flex items-center gap-1 p-1 rounded-lg border", styles.toggleBg)}>
          {displayModes.map((mode) => {
            const Icon = mode.icon
            return (
              <button
                key={mode.id}
                onClick={() => setDisplayMode(mode.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-medium transition-all duration-200",
                  displayMode === mode.id ? styles.toggleActive : styles.toggleInactive
                )}
                title={mode.description}
              >
                <Icon className="w-3.5 h-3.5" />
                {mode.label}
              </button>
            )
          })}
        </div>

        {/* Live Radio */}
        <div className={cn("flex items-center gap-2 px-2.5 py-1 rounded border", styles.liveBg)}>
          <div className={cn("w-2 h-2 rounded-full animate-pulse", styles.liveDot)} />
          <Radio className={cn("w-4 h-4", styles.liveText)} />
          <span className={cn("text-xs font-medium uppercase", styles.liveText)}>Live</span>
        </div>

        {/* AI Sync */}
        <div className={cn("flex items-center gap-2 px-2.5 py-1 rounded border", styles.syncBg)}>
          <Activity className={cn("w-4 h-4", styles.syncText)} />
          <span className={cn("text-xs font-medium", styles.syncText)}>AI Sync</span>
        </div>

        {/* Weather */}
        <div className={cn("flex items-center gap-1.5", styles.mutedText)}>
          <Wind className="w-4 h-4" />
          <span className="text-xs">12 mph NW</span>
        </div>

        {/* Connection */}
        <div className="flex items-center gap-1.5">
          <Wifi className={cn("w-4 h-4", styles.syncText)} />
          <div className="flex gap-0.5">
            <div className={cn("w-1 h-2 rounded-sm", displayMode === "night-vision" ? "bg-green-500" : displayMode === "light" ? "bg-emerald-500" : "bg-sync")} />
            <div className={cn("w-1 h-3 rounded-sm", displayMode === "night-vision" ? "bg-green-500" : displayMode === "light" ? "bg-emerald-500" : "bg-sync")} />
            <div className={cn("w-1 h-4 rounded-sm", displayMode === "night-vision" ? "bg-green-500" : displayMode === "light" ? "bg-emerald-500" : "bg-sync")} />
            <div className={cn("w-1 h-5 rounded-sm", displayMode === "night-vision" ? "bg-green-500" : displayMode === "light" ? "bg-emerald-500" : "bg-sync")} />
          </div>
        </div>
      </div>
    </header>
  )
}
