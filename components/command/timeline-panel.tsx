"use client"

import { Play, Pause, RotateCcw, FastForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSimulation, timelineEvents, TimelineEventId } from "./simulation-context"
import { cn } from "@/lib/utils"

export function TimelinePanel() {
  const { selectedEventId, setSelectedEventId, isPlaying, setIsPlaying } = useSimulation()

  const handleEventClick = (id: TimelineEventId) => {
    setSelectedEventId(id)
  }

  return (
    <div className="h-24 bg-card/90 border-t border-border flex flex-col">
      {/* Timeline Header */}
      <div className="px-4 py-2 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Incident Timeline</span>
          <span className="text-[10px] text-muted-foreground font-mono">T+14:32</span>
        </div>
        
        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            onClick={() => setSelectedEventId(1)}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button 
            variant={isPlaying ? "secondary" : "default"}
            size="sm" 
            className="h-7 w-7 p-0"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            onClick={() => setSelectedEventId(8)}
          >
            <FastForward className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeline Track */}
      <div className="flex-1 px-4 py-2 flex items-center">
        <div className="relative w-full">
          {/* Track Line Background */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          
          {/* Track Line Progress */}
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-accent -translate-y-1/2 transition-all duration-300"
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
                      isPassed && "bg-accent border-accent",
                      isActive && "bg-fire border-fire scale-125",
                      !isPassed && !isActive && "bg-secondary border-border group-hover:border-accent/50"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-fire/30 animate-ping" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="flex flex-col items-center">
                    <span className={cn(
                      "text-[9px] font-medium transition-colors duration-300",
                      isPassed && "text-foreground",
                      isActive && "text-fire",
                      !isPassed && !isActive && "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {event.label}
                    </span>
                    <span className="text-[8px] text-muted-foreground font-mono">{event.time}</span>
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
