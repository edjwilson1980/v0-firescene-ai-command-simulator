"use client"

import { ZoomIn, ZoomOut, RotateCcw, Layers, Crosshair, Map, Satellite, Globe, Grid3x3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSimulation, SectorView, MapSource } from "./simulation-context"
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

const compassRotation: Record<SectorView, number> = {
  alpha: 0,
  bravo: 90,
  charlie: 180,
  delta: 270,
  roof: 0,
  overhead: 0,
  interior: 0,
}

const sceneTransform: Record<SectorView, string> = {
  alpha: "rotateX(55deg) rotateZ(-45deg)",
  bravo: "rotateX(55deg) rotateZ(-135deg)",
  charlie: "rotateX(55deg) rotateZ(135deg)",
  delta: "rotateX(55deg) rotateZ(45deg)",
  roof: "rotateX(90deg) rotateZ(-45deg)",
  overhead: "rotateX(90deg) rotateZ(0deg)",
  interior: "rotateX(55deg) rotateZ(-45deg) scale(1.3)",
}

const mapSourceIcons: Record<MapSource, typeof Map> = {
  tactical: Grid3x3,
  satellite: Satellite,
  "google-maps": Map,
  "google-earth": Globe,
}

const mapSourceLabels: Record<MapSource, string> = {
  tactical: "Tactical",
  satellite: "Satellite",
  "google-maps": "Maps",
  "google-earth": "Earth",
}

const mapSourceStyles: Record<MapSource, { bg: string; grid: string }> = {
  tactical: {
    bg: "bg-background/50",
    grid: "rgba(100, 150, 200, 0.1)",
  },
  satellite: {
    bg: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    grid: "rgba(50, 80, 50, 0.15)",
  },
  "google-maps": {
    bg: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800",
    grid: "rgba(200, 200, 200, 0.08)",
  },
  "google-earth": {
    bg: "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950",
    grid: "rgba(80, 120, 200, 0.1)",
  },
}

export function TacticalViewport() {
  const { selectedSector, setSelectedSector, mapSource, setMapSource, currentEvent } = useSimulation()
  const currentMapStyle = mapSourceStyles[mapSource]
  const isInterior = selectedSector === "interior"
  const isRoofView = selectedSector === "roof" || selectedSector === "overhead"

  const sectors: SectorView[] = ["alpha", "bravo", "charlie", "delta", "roof", "overhead", "interior"]
  const mapSources: MapSource[] = ["tactical", "satellite", "google-maps", "google-earth"]

  return (
    <div className="flex-1 flex flex-col tactical-card overflow-hidden relative">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Tactical Viewport</span>
          <div className={cn(
            "px-2 py-0.5 rounded border",
            currentEvent.fireStatus === "spreading" && "bg-fire/20 border-fire/30",
            currentEvent.fireStatus === "active" && "bg-fire/20 border-fire/30",
            currentEvent.fireStatus === "contained" && "bg-hazard/20 border-hazard/30",
            currentEvent.fireStatus === "knocked" && "bg-safe/20 border-safe/30",
          )}>
            <span className={cn(
              "text-[10px] font-medium uppercase",
              currentEvent.fireStatus === "spreading" && "text-fire",
              currentEvent.fireStatus === "active" && "text-fire",
              currentEvent.fireStatus === "contained" && "text-hazard",
              currentEvent.fireStatus === "knocked" && "text-safe",
            )}>
              {currentEvent.fireStatus === "spreading" ? "FIRE SPREADING" : 
               currentEvent.fireStatus === "active" ? "ACTIVE FIRE" :
               currentEvent.fireStatus === "contained" ? "FIRE CONTAINED" : "FIRE KNOCKED"}
            </span>
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
      <div className={cn("flex-1 relative overflow-hidden scanlines transition-all duration-500", currentMapStyle.bg)}>
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-500"
          style={{
            backgroundImage: `
              linear-gradient(${currentMapStyle.grid} 1px, transparent 1px),
              linear-gradient(90deg, ${currentMapStyle.grid} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Map Source Toggle - Top Left */}
        <div className="absolute top-4 left-4 flex gap-1 p-1 bg-card/90 border border-border rounded-lg z-20">
          {mapSources.map((source) => {
            const Icon = mapSourceIcons[source]
            return (
              <button
                key={source}
                onClick={() => setMapSource(source)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded text-[10px] font-medium transition-all duration-200",
                  mapSource === source
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="w-3 h-3" />
                {mapSourceLabels[source]}
              </button>
            )
          })}
        </div>

        {/* Compass - Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <div className="w-24 h-24 bg-card/90 border border-border rounded-full p-2 relative">
            {/* Compass Ring */}
            <div className="absolute inset-2 rounded-full border-2 border-border/50" />
            
            {/* Cardinal Directions */}
            <div 
              className="absolute inset-0 transition-transform duration-500"
              style={{ transform: `rotate(${compassRotation[selectedSector]}deg)` }}
            >
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-fire">N</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground">S</span>
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">W</span>
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">E</span>
            </div>

            {/* Compass Needle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-1 h-10 relative transition-transform duration-500"
                style={{ transform: `rotate(${-compassRotation[selectedSector]}deg)` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[16px] border-l-transparent border-r-transparent border-b-fire" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[16px] border-l-transparent border-r-transparent border-t-muted-foreground/50" />
              </div>
            </div>

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent border border-accent-foreground" />
          </div>
          
          {/* View Label */}
          <div className="mt-2 px-3 py-1.5 bg-card/90 border border-border rounded text-center">
            <span className="text-[10px] text-muted-foreground">Viewing:</span>
            <span className="text-xs font-medium text-foreground ml-1">{sectorLabels[selectedSector]}</span>
          </div>
        </div>

        {/* Sector Buttons - Bottom Left */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className="p-2 bg-card/90 border border-border rounded-lg">
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider mb-2">Select View</div>
            <div className="grid grid-cols-2 gap-1">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={cn(
                    "px-2 py-1.5 rounded text-[10px] font-medium transition-all duration-200",
                    selectedSector === sector
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {sectorLabels[sector]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scene Status - Bottom Center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-2 bg-card/90 border border-border rounded-lg text-center">
            <span className="text-[10px] text-muted-foreground block">{currentEvent.label}</span>
            <span className="text-xs font-medium text-foreground">{currentEvent.sceneNote}</span>
          </div>
        </div>

        {/* Isometric Container */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
          <div 
            className="relative transition-transform duration-700 ease-out"
            style={{ 
              transform: sceneTransform[selectedSector],
              transformStyle: "preserve-3d"
            }}
          >
            {/* Street Grid */}
            <div className="absolute -left-48 -top-48 w-[500px] h-[500px]">
              {/* Horizontal Street */}
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 w-full h-16 border-y border-border/50 transition-colors duration-500",
                mapSource === "satellite" ? "bg-slate-700/60" : 
                mapSource === "google-earth" ? "bg-slate-800/60" : "bg-secondary/60"
              )} />
              {/* Vertical Street */}
              <div className={cn(
                "absolute left-1/2 -translate-x-1/2 h-full w-16 border-x border-border/50 transition-colors duration-500",
                mapSource === "satellite" ? "bg-slate-700/60" : 
                mapSource === "google-earth" ? "bg-slate-800/60" : "bg-secondary/60"
              )} />
              
              {/* Sidewalks */}
              <div className="absolute top-1/2 -translate-y-[calc(50%+32px)] w-full h-3 bg-muted/40" />
              <div className="absolute top-1/2 translate-y-[calc(50%+20px)] w-full h-3 bg-muted/40" />
            </div>

            {/* Main Fire Building */}
            <div className={cn("relative w-40 h-40 transition-opacity duration-300", isInterior && "opacity-60")}>
              {/* Building Base/First Floor */}
              <div 
                className={cn(
                  "absolute bottom-0 left-0 w-full h-20 border-2 transition-all duration-500",
                  currentEvent.fireStatus === "knocked" ? "border-safe/60" : "border-fire/60"
                )}
                style={{
                  background: currentEvent.fireStatus === "knocked" 
                    ? "linear-gradient(135deg, rgba(100, 150, 100, 0.2) 0%, rgba(80, 120, 80, 0.3) 100%)"
                    : "linear-gradient(135deg, rgba(200, 80, 60, 0.3) 0%, rgba(150, 50, 30, 0.4) 100%)",
                  boxShadow: currentEvent.fireStatus === "knocked"
                    ? "inset 0 0 20px rgba(100, 200, 100, 0.2)"
                    : "inset 0 0 30px rgba(255, 100, 50, 0.3), 0 0 40px rgba(255, 80, 30, 0.4)"
                }}
              >
                {/* Windows */}
                <div className={cn(
                  "absolute top-2 left-2 w-6 h-8 border transition-all duration-500",
                  currentEvent.fireStatus === "knocked" 
                    ? "bg-safe/30 border-safe/50" 
                    : "bg-fire/50 border-fire/70 animate-pulse"
                )} />
                <div className={cn(
                  "absolute top-2 left-10 w-6 h-8 border transition-all duration-500",
                  currentEvent.fireStatus === "knocked" 
                    ? "bg-safe/30 border-safe/50" 
                    : "bg-fire/50 border-fire/70 animate-pulse"
                )} style={{ animationDelay: "0.3s" }} />
                <div className="absolute top-2 right-2 w-8 h-10 bg-secondary/40 border border-border/50" /> {/* Door */}
              </div>

              {/* Second Floor */}
              <div 
                className={cn(
                  "absolute bottom-20 left-0 w-full h-16 border-2 border-t-0 transition-all duration-500",
                  currentEvent.fireStatus === "knocked" ? "border-safe/60" : "border-fire/80"
                )}
                style={{
                  background: currentEvent.fireStatus === "knocked"
                    ? "linear-gradient(135deg, rgba(100, 180, 100, 0.3) 0%, rgba(80, 140, 80, 0.4) 100%)"
                    : "linear-gradient(135deg, rgba(255, 100, 50, 0.4) 0%, rgba(200, 60, 20, 0.5) 100%)",
                  boxShadow: currentEvent.fireStatus === "knocked"
                    ? "inset 0 0 30px rgba(100, 200, 100, 0.3)"
                    : "inset 0 0 40px rgba(255, 120, 60, 0.5), 0 0 60px rgba(255, 80, 30, 0.6)"
                }}
              >
                {/* Windows with fire */}
                {currentEvent.fireStatus !== "knocked" ? (
                  <>
                    <div className="absolute top-2 left-2 w-6 h-7 bg-fire border border-fire-glow animate-pulse">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-fire-glow/80 blur-sm animate-bounce" style={{ animationDuration: "0.5s" }} />
                    </div>
                    <div className="absolute top-2 left-10 w-6 h-7 bg-fire/80 border border-fire-glow animate-pulse" style={{ animationDelay: "0.2s" }}>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-fire-glow/70 blur-md animate-bounce" style={{ animationDuration: "0.6s" }} />
                    </div>
                    <div className="absolute top-2 right-2 w-6 h-7 bg-fire/60 border border-fire/70 animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </>
                ) : (
                  <>
                    <div className="absolute top-2 left-2 w-6 h-7 bg-safe/40 border border-safe/60" />
                    <div className="absolute top-2 left-10 w-6 h-7 bg-safe/40 border border-safe/60" />
                    <div className="absolute top-2 right-2 w-6 h-7 bg-safe/40 border border-safe/60" />
                  </>
                )}
              </div>

              {/* Roof */}
              <div 
                className={cn(
                  "absolute bottom-36 left-0 w-full h-4 bg-muted border-2 border-border/60",
                  isRoofView && "bg-muted/80 border-accent"
                )}
                style={{ transform: "translateY(-1px)" }}
              >
                {/* Roof opening indicator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-hazard/40 border border-hazard/60">
                  <span className="text-[6px] text-hazard font-bold absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">VENT</span>
                </div>
              </div>

              {/* Smoke Effect - only show when fire not knocked */}
              {currentEvent.fireStatus !== "knocked" && (
                <div className="absolute -top-16 left-1/4 w-20 h-20">
                  <div className="absolute w-10 h-10 bg-muted-foreground/30 rounded-full blur-xl animate-pulse" />
                  <div className="absolute left-4 top-4 w-8 h-8 bg-muted-foreground/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute left-2 top-8 w-6 h-6 bg-muted-foreground/15 rounded-full blur-md animate-pulse" style={{ animationDelay: "1s" }} />
                </div>
              )}

              {/* Interior View Overlay */}
              {isInterior && (
                <div className="absolute inset-0 border-2 border-accent/60 bg-accent/10 rounded">
                  <div className="absolute inset-2 grid grid-cols-2 grid-rows-2 gap-1">
                    <div className="bg-fire/20 border border-fire/40 flex items-center justify-center">
                      <span className="text-[7px] text-fire font-bold">FIRE</span>
                    </div>
                    <div className="bg-secondary/40 border border-border/40 flex items-center justify-center">
                      <span className="text-[7px] text-muted-foreground">ROOM</span>
                    </div>
                    <div className="bg-safe/20 border border-safe/40 flex items-center justify-center">
                      <span className="text-[7px] text-safe font-bold">CLEAR</span>
                    </div>
                    <div className="bg-hazard/20 border border-hazard/40 flex items-center justify-center">
                      <span className="text-[7px] text-hazard">SEARCH</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Collapse Zone */}
            <div 
              className="absolute -bottom-8 -left-8 w-56 h-56 border-2 border-dashed border-hazard/60 rounded-lg"
              style={{ transform: "translateZ(-2px)" }}
            >
              <span className="absolute bottom-1 right-2 text-[8px] text-hazard font-bold uppercase tracking-wider">Collapse Zone</span>
            </div>

            {/* Exposure Building - Left (Bravo) */}
            <div className="absolute -left-32 top-4 w-24 h-24">
              <div className="w-full h-16 bg-secondary border border-border/60">
                <div className="absolute top-2 left-2 w-4 h-5 bg-muted border border-border/40" />
                <div className="absolute top-2 right-2 w-4 h-5 bg-muted border border-border/40" />
              </div>
              <div className="w-full h-3 bg-muted border-x border-b border-border/40" />
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground">EXPOSURE B</span>
            </div>

            {/* Exposure Building - Right (Delta) */}
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

            {/* Battalion 2 - Command Post */}
            <div className="absolute -bottom-32 -left-8 w-16 h-6 bg-accent/60 border border-accent rounded-sm">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] text-accent font-bold whitespace-nowrap">BAT 2</span>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[6px] text-accent/70">CMD</span>
            </div>

            {/* Ambulance 7 */}
            <div className="absolute -bottom-36 right-16 w-14 h-6 bg-safe/60 border border-safe rounded-sm">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] text-safe font-bold whitespace-nowrap">AMB 7</span>
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
            {/* Crew A - Interior Search */}
            <div className="absolute -left-4 bottom-8 flex flex-col gap-1">
              <div className="w-3 h-3 rounded-full bg-safe border border-safe-glow animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-safe border border-safe-glow animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="text-[6px] text-safe font-bold">SEARCH</span>
            </div>

            {/* Roof Team */}
            <div className="absolute right-0 bottom-12 flex flex-col gap-1">
              <div className="w-3 h-3 rounded-full bg-hazard border border-hazard-glow animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-hazard border border-hazard-glow animate-pulse" style={{ animationDelay: "0.3s" }} />
              <span className="text-[6px] text-hazard font-bold">ROOF</span>
            </div>

            {/* RIT Team */}
            <div className="absolute -right-12 -bottom-16 flex flex-col gap-1">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-water border border-water-glow" />
                <div className="w-3 h-3 rounded-full bg-water border border-water-glow" />
              </div>
              <span className="text-[6px] text-water font-bold">RIT</span>
            </div>

            {/* Extinguished Area Indicator */}
            <div 
              className={cn(
                "absolute bottom-0 left-0 w-16 h-10 border rounded transition-all duration-500",
                currentEvent.fireStatus === "knocked" 
                  ? "border-safe bg-safe/20" 
                  : "border-safe/50 bg-safe/10"
              )}
              style={{ transform: "translateY(2px)" }}
            >
              <span className="text-[6px] text-safe font-bold absolute bottom-0.5 left-1">CLEAR</span>
            </div>
          </div>
        </div>

        {/* Side Labels */}
        <div className={cn(
          "absolute top-1/2 left-4 -translate-y-1/2 px-2 py-1 border rounded text-[10px] font-bold transition-all duration-300",
          selectedSector === "alpha" ? "bg-accent text-accent-foreground border-accent" : "bg-secondary/80 border-border text-foreground"
        )}>
          ALPHA
        </div>
        <div className={cn(
          "absolute top-1/2 right-32 -translate-y-1/2 px-2 py-1 border rounded text-[10px] font-bold transition-all duration-300",
          selectedSector === "charlie" ? "bg-accent text-accent-foreground border-accent" : "bg-secondary/80 border-border text-foreground"
        )}>
          CHARLIE
        </div>
        <div className={cn(
          "absolute top-16 left-1/2 -translate-x-1/2 px-2 py-1 border rounded text-[10px] font-bold transition-all duration-300",
          selectedSector === "bravo" ? "bg-accent text-accent-foreground border-accent" : "bg-secondary/80 border-border text-foreground"
        )}>
          BRAVO
        </div>
        <div className={cn(
          "absolute bottom-32 left-1/2 -translate-x-1/2 px-2 py-1 border rounded text-[10px] font-bold transition-all duration-300",
          selectedSector === "delta" ? "bg-accent text-accent-foreground border-accent" : "bg-secondary/80 border-border text-foreground"
        )}>
          DELTA
        </div>

        {/* Legend - Bottom Right */}
        <div className="absolute bottom-4 right-4 flex gap-3 px-3 py-2 bg-card/90 border border-border rounded-lg z-10">
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

        {/* AI Confidence Badge - Moved to avoid overlap with compass */}
        <div className="absolute top-32 right-4 px-3 py-2 bg-card/90 border border-accent/30 rounded-lg z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sync animate-pulse" />
            <span className="text-[10px] text-accent font-medium">AI Confidence: 94%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
