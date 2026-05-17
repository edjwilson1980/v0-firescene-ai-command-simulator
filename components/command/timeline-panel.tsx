"use client"

import { Play, Pause, RotateCcw, FastForward, CircleDot } from "lucide-react"
import { Button } from "@/components/ui/button"

const timelineEvents = [
  { id: 1, time: "00:00", label: "Dispatch", active: true, passed: true },
  { id: 2, time: "03:42", label: "Arrival", active: true, passed: true },
  { id: 3, time: "04:15", label: "Smoke Showing", active: true, passed: true },
  { id: 4, time: "06:30", label: "Fire Located", active: true, passed: true },
  { id: 5, time: "08:45", label: "Roof Vent", active: true, passed: true },
  { id: 6, time: "12:18", label: "Water On", active: true, passed: true },
  { id: 7, time: "14:24", label: "Primary Search", active: true, passed: false },
  { id: 8, time: "--:--", label: "Fire Knocked", active: false, passed: false },
]

export function TimelinePanel() {
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
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" className="h-7 w-7 p-0">
            <Play className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Pause className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <FastForward className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeline Track */}
      <div className="flex-1 px-4 py-2 flex items-center">
        <div className="relative w-full">
          {/* Track Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 w-[85%] h-0.5 bg-accent -translate-y-1/2" />

          {/* Events */}
          <div className="relative flex justify-between items-center">
            {timelineEvents.map((event) => (
              <div key={event.id} className="flex flex-col items-center gap-1">
                {/* Marker */}
                <div 
                  className={`w-3 h-3 rounded-full border-2 ${
                    event.passed 
                      ? "bg-accent border-accent" 
                      : event.active 
                        ? "bg-fire/50 border-fire animate-pulse" 
                        : "bg-secondary border-border"
                  }`}
                >
                  {event.active && !event.passed && (
                    <div className="absolute w-3 h-3 rounded-full bg-fire/30 animate-ping" />
                  )}
                </div>
                
                {/* Label */}
                <div className="flex flex-col items-center">
                  <span className={`text-[9px] font-medium ${event.passed ? "text-foreground" : event.active ? "text-fire" : "text-muted-foreground"}`}>
                    {event.label}
                  </span>
                  <span className="text-[8px] text-muted-foreground font-mono">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
