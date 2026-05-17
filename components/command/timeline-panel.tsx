"use client"

import { Play, Pause, RotateCcw, FastForward, Volume2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSimulation, timelineEvents, TimelineEventId } from "./simulation-context"
import { cn } from "@/lib/utils"
import { useState, useRef } from "react"

export function TimelinePanel() {
  const { selectedEventId, setSelectedEventId, isPlaying, setIsPlaying, displayMode, voiceNotes } = useSimulation()
  const [playingVoiceNoteIndex, setPlayingVoiceNoteIndex] = useState<number | null>(null)
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([])

  const handleEventClick = (id: TimelineEventId) => {
    setSelectedEventId(id)
  }

  const handlePlayVoiceNote = (index: number, audioData: string) => {
    if (playingVoiceNoteIndex === index) {
      // Stop playing
      if (audioRefs.current[index]) {
        audioRefs.current[index]?.pause()
      }
      setPlayingVoiceNoteIndex(null)
    } else {
      // Stop any previously playing note
      if (playingVoiceNoteIndex !== null && audioRefs.current[playingVoiceNoteIndex]) {
        audioRefs.current[playingVoiceNoteIndex]?.pause()
      }
      // Play new note
      setPlayingVoiceNoteIndex(index)
      if (audioRefs.current[index]) {
        audioRefs.current[index]!.play()
      }
    }
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
      <div className={cn("px-4 py-2 border-b flex items-center justify-between", displayMode === "light" ? "border-slate-200" : "border-border/50")}>
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
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button 
            variant={isPlaying ? "secondary" : "default"}
            size="sm" 
            className={cn(
              "h-7 w-7 p-0",
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
            <FastForward className="w-4 h-4" />
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
                        displayMode === "light" ? "bg-red-400/30" : "bg-fire/30"
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

      {/* Voice Notes Display */}
      {voiceNotes.length > 0 && (
        <div className={cn("border-t px-4 py-2 max-h-32 overflow-y-auto", displayMode === "light" ? "border-slate-200" : "border-border/50")}>
          <div className={cn("text-[9px] uppercase tracking-wider font-semibold mb-2", styles.mutedText)}>
            Voice Notes ({voiceNotes.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {voiceNotes.map((note, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded border text-[9px] transition-all",
                  playingVoiceNoteIndex === index
                    ? "bg-accent/20 border-accent"
                    : "bg-secondary/50 border-border hover:bg-secondary"
                )}
              >
                <button
                  onClick={() => handlePlayVoiceNote(index, note.audioData)}
                  className="flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  <Volume2 className={cn("w-3 h-3", playingVoiceNoteIndex === index && "animate-pulse")} />
                  <span className="font-mono">{note.timestamp}</span>
                </button>
                <span className={cn("text-[8px]", styles.mutedText)}>
                  {note.duration}s
                </span>
                <audio
                  ref={(el) => {
                    audioRefs.current[index] = el
                  }}
                  src={note.audioData}
                  onEnded={() => setPlayingVoiceNoteIndex(null)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
