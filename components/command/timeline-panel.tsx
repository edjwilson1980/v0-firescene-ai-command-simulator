"use client"

import { Play, Pause, RotateCcw, FastForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSimulation, timelineEvents, TimelineEventId } from "./simulation-context"
import { cn } from "@/lib/utils"

export function TimelinePanel() {
  const { selectedEventId, setSelectedEventId, isPlaying, setIsPlaying, displayMode } = useSimulation()

  const handleEventClick = (id: TimelineEventId) => {
    setSelectedEventId(id)
  }

  const getDisplayModeStyles = () => {
    switch (displayMode) {
      case "light":
        return {
          containerBg: "bg-white/95 border-slate-300",
          textColor: "text-slate-900",
          mutedText: "text-slate-500",
          trackBg: "bg-slate-300",
          trackProgress: "bg-cyan-500",
          activeBg: "bg-red-500 border-red-500",
          activeText: "text-red-600",
          passedBg: "bg-cyan-500 border-cyan-500",
          inactiveBg: "bg-slate-100 border-slate-300",
          buttonHover: "hover:bg-slate-100",
        }
      case "night-vision":
        return {
          containerBg: "bg-black/95 border-green-900",
          textColor: "text-green-400",
          mutedText: "text-green-600",
          trackBg: "bg-green-900",
          trackProgress: "bg-green-500",
          activeBg: "bg-green-500 border-green-400",
          activeText: "text-green-400",
          passedBg: "bg-green-600 border-green-500",
          inactiveBg: "bg-green-950 border-green-800",
          buttonHover: "hover:bg-green-900/50",
        }
      default:
        return {
          containerBg: "bg-card/90 border-border",
          textColor: "text-foreground",
          mutedText: "text-muted-foreground",
          trackBg: "bg-border",
          trackProgress: "bg-accent",
          activeBg: "bg-fire border-fire",
          activeText: "text-fire",
          passedBg: "bg-accent border-accent",
          inactiveBg: "bg-secondary border-border",
          buttonHover: "hover:bg-secondary",
        }
    }
  }

  const styles = getDisplayModeStyles()

  return (
    <div className={cn("h-24 flex flex-col border-t", styles.containerBg)}>
      {/* Timeline Header */}
      <div className={cn("px-4 py-2 border-b flex items-center justify-between", displayMode === "light" ? "border-slate-200" : displayMode === "night-vision" ? "border-green-900/50" : "border-border/50")}>
        <div className="flex items-center gap-3">
          <span className={cn("text-xs font-semibold uppercase tracking-wide", styles.textColor)}>Incident Timeline</span>
          <span className={cn("text-[10px] font-mono", styles.mutedText)}>T+14:32</span>
        </div>
        
        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-7 w-7 p-0", styles.buttonHover)}
            onClick={() => setSelectedEventId(1)}
          >
            <RotateCcw className={cn("w-4 h-4", displayMode === "night-vision" && "text-green-400")} />
          </Button>
          <Button 
            variant={isPlaying ? "secondary" : "default"}
            size="sm" 
            className={cn(
              "h-7 w-7 p-0",
              displayMode === "night-vision" && (isPlaying ? "bg-green-800 text-green-300" : "bg-green-700 text-green-200"),
              displayMode === "light" && (isPlaying ? "bg-slate-200 text-slate-700" : "bg-cyan-600 text-white")
            )}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-7 w-7 p-0", styles.buttonHover)}
            onClick={() => setSelectedEventId(8)}
          >
            <FastForward className={cn("w-4 h-4", displayMode === "night-vision" && "text-green-400")} />
          </Button>
        </div>
      </div>

      {/* Timeline Track */}
      <div className="flex-1 px-4 py-2 flex items-center">
        <div className="relative w-full">
          {/* Track Line Background */}
          <div className={cn("absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2", styles.trackBg)} />
          
          {/* Track Line Progress */}
          <div 
            className={cn("absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transition-all duration-300", styles.trackProgress)}
            style={{ width: `${((selectedEventId - 1) / (timelineEvents.length - 1)) * 100}%` }}
          />

          {/* Events */}
          <div className="relative flex justify-between items-center">
            {timelineEvents.map((event) => {
              const isPassed = event.id < selectedEventId
              const isActive = event.id === selectedEventId
              
              return (
                <button
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  {/* Marker */}
                  <div 
                    className={cn(
                      "w-3 h-3 rounded-full border-2 transition-all duration-300 relative",
                      isPassed && styles.passedBg,
                      isActive && cn(styles.activeBg, "scale-125"),
                      !isPassed && !isActive && cn(styles.inactiveBg, "group-hover:border-accent/50")
                    )}
                  >
                    {isActive && (
                      <div className={cn(
                        "absolute inset-0 rounded-full animate-ping",
                        displayMode === "night-vision" ? "bg-green-400/30" : displayMode === "light" ? "bg-red-400/30" : "bg-fire/30"
                      )} />
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="flex flex-col items-center">
                    <span className={cn(
                      "text-[9px] font-medium transition-colors duration-300",
                      isPassed && styles.textColor,
                      isActive && styles.activeText,
                      !isPassed && !isActive && cn(styles.mutedText, "group-hover:text-foreground")
                    )}>
                      {event.label}
                    </span>
                    <span className={cn("text-[8px] font-mono", styles.mutedText)}>{event.time}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
