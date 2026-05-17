"use client"

import { Flame, Radio, Wifi, Wind, Activity, MapPin, Clock } from "lucide-react"

export function HeaderBar() {
  return (
    <header className="h-14 bg-card/90 border-b border-border flex items-center justify-between px-4 backdrop-blur-sm">
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground tracking-tight">FireScene AI</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Command Simulator</span>
          </div>
        </div>
      </div>

      {/* Incident Status */}
      <div className="flex items-center gap-6">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded bg-fire/20 border border-fire/40 glow-fire">
            <span className="text-xs font-bold text-fire uppercase tracking-wider">Working Fire</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">1234 S Halsted St, Chicago, IL</span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-secondary border border-border">
          <Clock className="w-4 h-4 text-accent" />
          <span className="text-sm font-mono font-semibold text-foreground">00:14:32</span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-4">
        {/* Live Radio */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-live/10 border border-live/30">
          <div className="w-2 h-2 rounded-full bg-live glow-live animate-pulse" />
          <Radio className="w-4 h-4 text-live" />
          <span className="text-xs font-medium text-live uppercase">Live</span>
        </div>

        {/* AI Sync */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-sync/10 border border-sync/30">
          <Activity className="w-4 h-4 text-sync" />
          <span className="text-xs font-medium text-sync">AI Sync</span>
        </div>

        {/* Weather */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Wind className="w-4 h-4" />
          <span className="text-xs">12 mph NW</span>
        </div>

        {/* Connection */}
        <div className="flex items-center gap-1.5">
          <Wifi className="w-4 h-4 text-sync" />
          <div className="flex gap-0.5">
            <div className="w-1 h-2 bg-sync rounded-sm" />
            <div className="w-1 h-3 bg-sync rounded-sm" />
            <div className="w-1 h-4 bg-sync rounded-sm" />
            <div className="w-1 h-5 bg-sync rounded-sm" />
          </div>
        </div>
      </div>
    </header>
  )
}
