"use client"

import { ZoomIn, ZoomOut, RotateCcw, Layers, Crosshair } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TacticalViewport() {
  return (
    <div className="flex-1 flex flex-col tactical-card overflow-hidden relative">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Tactical Viewport</span>
          <div className="px-2 py-0.5 rounded bg-fire/20 border border-fire/30">
            <span className="text-[10px] font-medium text-fire">ACTIVE INCIDENT</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Layers className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Crosshair className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Isometric Scene */}
      <div className="flex-1 relative overflow-hidden bg-background/50 scanlines">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100, 150, 200, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100, 150, 200, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Isometric Container */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
          <div 
            className="relative"
            style={{ 
              transform: "rotateX(55deg) rotateZ(-45deg)",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Street Grid */}
            <div className="absolute -left-48 -top-48 w-[500px] h-[500px]">
              {/* Horizontal Street */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-16 bg-secondary/60 border-y border-border/50" />
              {/* Vertical Street */}
              <div className="absolute left-1/2 -translate-x-1/2 h-full w-16 bg-secondary/60 border-x border-border/50" />
              
              {/* Sidewalks */}
              <div className="absolute top-1/2 -translate-y-[calc(50%+32px)] w-full h-3 bg-muted/40" />
              <div className="absolute top-1/2 translate-y-[calc(50%+20px)] w-full h-3 bg-muted/40" />
            </div>

            {/* Main Fire Building */}
            <div className="relative w-40 h-40">
              {/* Building Base/First Floor */}
              <div 
                className="absolute bottom-0 left-0 w-full h-20 border-2 border-fire/60"
                style={{
                  background: "linear-gradient(135deg, rgba(200, 80, 60, 0.3) 0%, rgba(150, 50, 30, 0.4) 100%)",
                  boxShadow: "inset 0 0 30px rgba(255, 100, 50, 0.3), 0 0 40px rgba(255, 80, 30, 0.4)"
                }}
              >
                {/* Windows */}
                <div className="absolute top-2 left-2 w-6 h-8 bg-fire/50 border border-fire/70 animate-pulse" />
                <div className="absolute top-2 left-10 w-6 h-8 bg-fire/50 border border-fire/70 animate-pulse" style={{ animationDelay: "0.3s" }} />
                <div className="absolute top-2 right-2 w-8 h-10 bg-secondary/40 border border-border/50" /> {/* Door */}
              </div>

              {/* Second Floor */}
              <div 
                className="absolute bottom-20 left-0 w-full h-16 border-2 border-t-0 border-fire/80"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 100, 50, 0.4) 0%, rgba(200, 60, 20, 0.5) 100%)",
                  boxShadow: "inset 0 0 40px rgba(255, 120, 60, 0.5), 0 0 60px rgba(255, 80, 30, 0.6)"
                }}
              >
                {/* Windows with fire */}
                <div className="absolute top-2 left-2 w-6 h-7 bg-fire border border-fire-glow animate-pulse">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-fire-glow/80 blur-sm animate-bounce" style={{ animationDuration: "0.5s" }} />
                </div>
                <div className="absolute top-2 left-10 w-6 h-7 bg-fire/80 border border-fire-glow animate-pulse" style={{ animationDelay: "0.2s" }}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-fire-glow/70 blur-md animate-bounce" style={{ animationDuration: "0.6s" }} />
                </div>
                <div className="absolute top-2 right-2 w-6 h-7 bg-fire/60 border border-fire/70 animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>

              {/* Roof */}
              <div 
                className="absolute bottom-36 left-0 w-full h-4 bg-muted border-2 border-border/60"
                style={{ transform: "translateY(-1px)" }}
              >
                {/* Roof opening indicator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-hazard/40 border border-hazard/60">
                  <span className="text-[6px] text-hazard font-bold absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">VENT</span>
                </div>
              </div>

              {/* Smoke Effect */}
              <div className="absolute -top-16 left-1/4 w-20 h-20">
                <div className="absolute w-10 h-10 bg-muted-foreground/30 rounded-full blur-xl animate-pulse" />
                <div className="absolute left-4 top-4 w-8 h-8 bg-muted-foreground/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: "0.5s" }} />
                <div className="absolute left-2 top-8 w-6 h-6 bg-muted-foreground/15 rounded-full blur-md animate-pulse" style={{ animationDelay: "1s" }} />
              </div>
            </div>

            {/* Collapse Zone */}
            <div 
              className="absolute -bottom-8 -left-8 w-56 h-56 border-2 border-dashed border-hazard/60 rounded-lg"
              style={{ transform: "translateZ(-2px)" }}
            >
              <span className="absolute bottom-1 right-2 text-[8px] text-hazard font-bold uppercase tracking-wider">Collapse Zone</span>
            </div>

            {/* Exposure Building - Left */}
            <div className="absolute -left-32 top-4 w-24 h-24">
              <div className="w-full h-16 bg-secondary border border-border/60">
                <div className="absolute top-2 left-2 w-4 h-5 bg-muted border border-border/40" />
                <div className="absolute top-2 right-2 w-4 h-5 bg-muted border border-border/40" />
              </div>
              <div className="w-full h-3 bg-muted border-x border-b border-border/40" />
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground">EXPOSURE B</span>
            </div>

            {/* Exposure Building - Right */}
            <div className="absolute -right-28 top-8 w-20 h-20">
              <div className="w-full h-14 bg-secondary border border-border/60">
                <div className="absolute top-2 left-2 w-4 h-5 bg-muted border border-border/40" />
                <div className="absolute top-2 right-2 w-4 h-5 bg-muted border border-border/40" />
              </div>
              <div className="w-full h-3 bg-muted border-x border-b border-border/40" />
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground">EXPOSURE D</span>
            </div>

            {/* Fire Apparatus */}
            {/* Engine 12 */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-20 h-8 bg-fire/80 border border-fire rounded-sm glow-fire">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] text-fire font-bold whitespace-nowrap">ENG 12</span>
              <div className="absolute top-1 left-1 w-2 h-2 bg-hazard rounded-full animate-pulse" />
            </div>

            {/* Truck 5 */}
            <div className="absolute -left-20 -bottom-20 w-24 h-8 bg-hazard/70 border border-hazard rounded-sm glow-hazard rotate-45">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] text-hazard font-bold whitespace-nowrap -rotate-45">TRK 5</span>
            </div>

            {/* Hose Lines */}
            <svg className="absolute -bottom-24 left-0 w-64 h-32 pointer-events-none">
              {/* Main attack line */}
              <path
                d="M 100,60 Q 80,40 70,20 Q 60,0 80,-10"
                fill="none"
                stroke="oklch(0.55 0.2 230)"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-pulse"
              />
              {/* Supply line */}
              <path
                d="M 100,60 L 140,70 L 200,70"
                fill="none"
                stroke="oklch(0.55 0.2 230 / 0.6)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8,4"
              />
            </svg>

            {/* Hydrant */}
            <div className="absolute bottom-0 right-32 w-4 h-6 bg-water border border-water-glow rounded-t-full glow-water">
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[6px] text-water font-bold">HYD</span>
            </div>

            {/* Firefighter Teams */}
            <div className="absolute -left-4 bottom-8 flex flex-col gap-1">
              <div className="w-3 h-3 rounded-full bg-safe border border-safe-glow animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-safe border border-safe-glow animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="text-[6px] text-safe font-bold">CREW A</span>
            </div>

            <div className="absolute right-0 bottom-12 flex flex-col gap-1">
              <div className="w-3 h-3 rounded-full bg-hazard border border-hazard-glow animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-hazard border border-hazard-glow animate-pulse" style={{ animationDelay: "0.3s" }} />
              <span className="text-[6px] text-hazard font-bold">ROOF</span>
            </div>

            {/* Extinguished Area Indicator */}
            <div 
              className="absolute bottom-0 left-0 w-16 h-10 border border-safe/50 bg-safe/10 rounded"
              style={{ transform: "translateY(2px)" }}
            >
              <span className="text-[6px] text-safe font-bold absolute bottom-0.5 left-1">CLEAR</span>
            </div>
          </div>
        </div>

        {/* Side Labels */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 px-2 py-1 bg-secondary/80 border border-border rounded text-[10px] font-bold text-foreground">
          ALPHA
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 px-2 py-1 bg-secondary/80 border border-border rounded text-[10px] font-bold text-foreground">
          CHARLIE
        </div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2 py-1 bg-secondary/80 border border-border rounded text-[10px] font-bold text-foreground">
          BRAVO
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 bg-secondary/80 border border-border rounded text-[10px] font-bold text-foreground">
          DELTA
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex gap-3 px-3 py-2 bg-card/90 border border-border rounded-lg">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-fire" />
            <span className="text-[9px] text-muted-foreground">Fire</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-water" />
            <span className="text-[9px] text-muted-foreground">Water</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-safe" />
            <span className="text-[9px] text-muted-foreground">Clear</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border-2 border-dashed border-hazard" />
            <span className="text-[9px] text-muted-foreground">Hazard</span>
          </div>
        </div>

        {/* AI Confidence Badge */}
        <div className="absolute top-4 right-4 px-3 py-2 bg-card/90 border border-accent/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sync animate-pulse" />
            <span className="text-[10px] text-accent font-medium">AI Confidence: 94%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
