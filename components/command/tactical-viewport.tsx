"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { 
  ZoomIn, ZoomOut, RotateCcw, RotateCw, Layers, 
  Map, Satellite, Globe, Grid3x3, Home, Move, Crosshair
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSimulation, SectorView, FloorView, MapSource, incidentLocation } from "./simulation-context"
import { FloorTacticalNotes } from "./floor-tactical-notes"
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

const floorLabels: Record<FloorView, string> = {
  basement: "Basement",
  floor1: "Floor 1",
  floor2: "Floor 2",
  floor3: "Floor 3",
  attic: "Attic",
  roof: "Roof",
}

const compassRotationForAngle = (rotateZ: number): number => {
  return -rotateZ - 45
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
  "google-maps": "Streets",
  "google-earth": "Overview",
}

const mapSourceStyles: Record<MapSource, { bg: string; grid: string; label: string }> = {
  tactical: {
    bg: "tactical-bg",
    grid: "rgba(100, 150, 200, 0.1)",
    label: "Tactical Grid",
  },
  satellite: {
    bg: "satellite-bg",
    grid: "rgba(50, 80, 50, 0.08)",
    label: "Satellite View",
  },
  "google-maps": {
    bg: "streets-bg",
    grid: "rgba(180, 180, 180, 0.12)",
    label: "Street Map",
  },
  "google-earth": {
    bg: "overview-bg",
    grid: "rgba(80, 120, 200, 0.08)",
    label: "Overview Map",
  },
}

export function TacticalViewport() {
  const { 
    selectedSector, 
    mapSource, setMapSource, 
    currentEvent,
    viewportTransform, setViewportTransform,
    isFreeRotate, setIsFreeRotate,
    resetViewport, goToSector, goToFloor,
    viewMode, selectedFloor,
    displayMode
  } = useSimulation()
  
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [panMode, setPanMode] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const currentMapStyle = mapSourceStyles[mapSource]
  const isInterior = selectedSector === "interior"
  const isRoofView = selectedSector === "roof" || selectedSector === "overhead"

  const mapSources: MapSource[] = ["tactical", "satellite", "google-maps", "google-earth"]
  const sectors: SectorView[] = ["alpha", "bravo", "charlie", "delta", "roof", "overhead", "interior"]
  const floors: FloorView[] = ["basement", "floor1", "floor2", "floor3", "attic", "roof"]

  // Handle mouse/touch drag for rotation
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (panMode) {
      setIsPanning(true)
    } else {
      setIsDragging(true)
    }
    setDragStart({ x: clientX, y: clientY })
  }, [panMode])

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging && !isPanning) return
    
    const deltaX = clientX - dragStart.x
    const deltaY = clientY - dragStart.y
    
    if (isPanning) {
      setViewportTransform({
        ...viewportTransform,
        panX: viewportTransform.panX + deltaX * 0.5,
        panY: viewportTransform.panY + deltaY * 0.5,
      })
    } else if (isDragging) {
      setViewportTransform({
        ...viewportTransform,
        rotateZ: viewportTransform.rotateZ + deltaX * 0.3,
        rotateX: Math.min(90, Math.max(20, viewportTransform.rotateX - deltaY * 0.2)),
      })
      setIsFreeRotate(true)
    }
    
    setDragStart({ x: clientX, y: clientY })
  }, [isDragging, isPanning, dragStart, viewportTransform, setViewportTransform, setIsFreeRotate])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setIsPanning(false)
  }, [])

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX, e.clientY)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY)
  }

  const onMouseUp = () => handleDragEnd()
  const onMouseLeave = () => handleDragEnd()

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const onTouchEnd = () => handleDragEnd()

  // Wheel zoom
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newZoom = Math.min(2.5, Math.max(0.5, viewportTransform.zoom + delta))
    setViewportTransform({ ...viewportTransform, zoom: newZoom })
    if (Math.abs(newZoom - 1) > 0.05) {
      setIsFreeRotate(true)
    }
  }, [viewportTransform, setViewportTransform, setIsFreeRotate])

  // Control buttons
  const handleZoomIn = () => {
    const newZoom = Math.min(2.5, viewportTransform.zoom + 0.2)
    setViewportTransform({ ...viewportTransform, zoom: newZoom })
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(0.5, viewportTransform.zoom - 0.2)
    setViewportTransform({ ...viewportTransform, zoom: newZoom })
  }

  const handleRotateLeft = () => {
    setViewportTransform({ ...viewportTransform, rotateZ: viewportTransform.rotateZ - 15 })
    setIsFreeRotate(true)
  }

  const handleRotateRight = () => {
    setViewportTransform({ ...viewportTransform, rotateZ: viewportTransform.rotateZ + 15 })
    setIsFreeRotate(true)
  }

  const viewLabel = isFreeRotate ? "Free Rotate" : sectorLabels[selectedSector]

  // Get display mode specific styles
  const getDisplayModeStyles = () => {
    switch (displayMode) {
      case "light":
        return {
          containerBg: "bg-slate-200",
          gridColor: "rgba(50, 80, 120, 0.15)",
          panelBg: "bg-white/90 border-slate-300",
          textColor: "text-slate-900",
          mutedText: "text-slate-600",
          useMapBg: false,
        }
      default:
        return {
          containerBg: currentMapStyle.bg,
          gridColor: currentMapStyle.grid,
          panelBg: "bg-card/90 border-border",
          textColor: "text-foreground",
          mutedText: "text-muted-foreground",
          useMapBg: true,
        }
    }
  }

  const styles = getDisplayModeStyles()

  return (
    <div className="flex-1 flex flex-col tactical-card overflow-hidden relative">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn("text-sm font-semibold uppercase tracking-wide", styles.textColor)}>Tactical Viewport</span>
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
        
        {/* Map Source Toggle - In Header */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/50 border border-border">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground mr-1">Map:</span>
          {mapSources.map((source) => {
            const Icon = mapSourceIcons[source]
            return (
              <button
                key={source}
                onClick={() => setMapSource(source)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded text-[9px] font-medium transition-all duration-200",
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
        
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground mr-2">
            Zoom: {Math.round(viewportTransform.zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleRotateLeft} title="Rotate Left">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleRotateRight} title="Rotate Right">
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button 
            variant={panMode ? "secondary" : "ghost"} 
            size="sm" 
            className={cn("h-7 w-7 p-0", panMode && "bg-accent text-accent-foreground")} 
            onClick={() => setPanMode(!panMode)} 
            title="Pan Mode"
          >
            <Move className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={resetViewport} title="Reset View">
            <Home className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Layers className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Crosshair className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Isometric Scene with Interaction */}
      <div 
        ref={containerRef}
        className={cn(
          "flex-1 relative overflow-hidden scanlines transition-all duration-300 select-none",
          !styles.useMapBg && styles.containerBg,
          panMode ? "cursor-move" : "cursor-grab",
          (isDragging || isPanning) && "cursor-grabbing"
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        {/* Map Source Background Layer */}
        {styles.useMapBg && (
          <div className={cn("absolute inset-0 transition-all duration-500", currentMapStyle.bg)} />
        )}

        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-500"
          style={{
            backgroundImage: `
              linear-gradient(${styles.gridColor} 1px, transparent 1px),
              linear-gradient(90deg, ${styles.gridColor} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Compass - Top Right */}
        <div className="absolute top-4 right-4 z-20" onClick={(e) => e.stopPropagation()}>
          <div className={cn(
            "w-24 h-24 rounded-full p-2 relative border",
            styles.panelBg
          )}>
            {/* Compass Ring */}
            <div className="absolute inset-2 rounded-full border-2 border-border/50" />
            
            {/* Cardinal Directions - Fixed to true north based on cross street anchors */}
            <div 
              className="absolute inset-0 transition-transform duration-200"
              style={{ transform: `rotate(${compassRotationForAngle(viewportTransform.rotateZ)}deg)` }}
            >
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-fire">N</span>
              <span className={cn("absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium", styles.mutedText)}>S</span>
              <span className={cn("absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-medium", styles.mutedText)}>W</span>
              <span className={cn("absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-medium", styles.mutedText)}>E</span>
            </div>

            {/* Compass Needle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-1 h-10 relative transition-transform duration-200"
                style={{ transform: `rotate(${-compassRotationForAngle(viewportTransform.rotateZ)}deg)` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[16px] border-l-transparent border-r-transparent border-b-fire" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[16px] border-l-transparent border-r-transparent border-t-muted-foreground/50" />
              </div>
            </div>

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border bg-accent border-accent-foreground" />
          </div>
          
          {/* View Label with Cross Street Reference */}
          <div className={cn("mt-2 px-3 py-1.5 rounded text-center border", styles.panelBg)}>
            <span className={cn("text-[10px]", styles.mutedText)}>Viewing:</span>
            <span className={cn("text-xs font-medium ml-1", styles.textColor)}>{viewLabel}</span>
          </div>
        </div>

        {/* Sector/Floor Buttons - Top Left (compact/skidier styling) */}
        <div className="absolute top-4 left-4 z-20" onClick={(e) => e.stopPropagation()}>
          <div className={cn("p-1.5 rounded border", styles.panelBg)}>
            <div className="flex flex-col gap-0.5">
              {viewMode === "sector" ? (
                // Sector View Buttons
                sectors.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => goToSector(sector)}
                    className={cn(
                      "px-2 py-1 rounded text-[9px] font-bold transition-all duration-200 text-left",
                      selectedSector === sector && !isFreeRotate
                        ? "bg-accent text-accent-foreground"
                        : cn(styles.mutedText, "hover:bg-secondary hover:text-foreground")
                    )}
                  >
                    {sectorLabels[sector]}
                  </button>
                ))
              ) : (
                // Floor View Buttons
                floors.map((floor) => (
                  <button
                    key={floor}
                    onClick={() => goToFloor(floor)}
                    className={cn(
                      "px-2 py-1 rounded text-[9px] font-bold transition-all duration-200 text-left",
                      selectedFloor === floor && !isFreeRotate
                        ? "bg-accent text-accent-foreground"
                        : cn(styles.mutedText, "hover:bg-secondary hover:text-foreground")
                    )}
                  >
                    {floorLabels[floor]}
                  </button>
                ))
              )}
            </div>
            {isFreeRotate && (
              <button
                onClick={resetViewport}
                className="mt-1 w-full px-2 py-0.5 rounded text-[8px] font-medium bg-fire/20 text-fire border border-fire/30 hover:bg-fire/30 transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Isometric Scene Container */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
          style={{
            transform: `
              perspective(1200px) 
              rotateX(${viewportTransform.rotateX}deg) 
              rotateZ(${viewportTransform.rotateZ}deg)
              scale(${viewportTransform.zoom})
              translate(${viewportTransform.panX}px, ${viewportTransform.panY}px)
            `,
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="relative w-64 h-64">
            {/* Street Grid - Fixed Cross Street Anchors */}
            {/* These streets are FIXED anchor points that determine real-world orientation */}
            <div className="absolute -left-48 -top-48 w-[500px] h-[500px]">
              {/* W MARQUETTE RD - Primary E-W Street (runs through incident address) */}
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 w-full h-16 border-y transition-colors duration-500",
                mapSource === "satellite" ? "bg-slate-700/60 border-slate-600/50" : 
                mapSource === "google-earth" ? "bg-slate-800/60 border-slate-700/50" : 
                mapSource === "google-maps" ? "bg-slate-200/80 border-slate-300/60" :
                displayMode === "light" ? "bg-slate-400/60 border-slate-500/50" : "bg-secondary/60 border-border/50"
              )}>
                {/* Street name label - WEST end (fixed anchor) */}
                <div className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border",
                  
                  mapSource === "google-maps" ? "bg-white border-slate-300 text-slate-700" :
                  "bg-card/95 border-border text-foreground"
                )}>
                  <span className="opacity-60 mr-1">←</span> W Marquette Rd
                </div>
                {/* Street name label - EAST end (fixed anchor) */}
                <div className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border",
                  
                  mapSource === "google-maps" ? "bg-white border-slate-300 text-slate-700" :
                  "bg-card/95 border-border text-foreground"
                )}>
                  W Marquette Rd <span className="opacity-60 ml-1">→</span>
                </div>
                {/* Center line markings */}
                <div className={cn(
                  "absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5",
                  
                  mapSource === "google-maps" ? "bg-yellow-500/40" : "bg-hazard/20"
                )} style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)" }} />
              </div>
              
              {/* S CALIFORNIA AVE - Secondary N-S Street (west cross street - fixed anchor) */}
              <div className={cn(
                "absolute left-[30%] -translate-x-1/2 h-full w-14 border-x transition-colors duration-500",
                displayMode === "night-vision" ? "bg-green-950/60 border-green-900/50" :
                mapSource === "satellite" ? "bg-slate-700/60 border-slate-600/50" : 
                mapSource === "google-earth" ? "bg-slate-800/60 border-slate-700/50" : 
                mapSource === "google-maps" ? "bg-slate-200/80 border-slate-300/60" :
                displayMode === "light" ? "bg-slate-400/60 border-slate-500/50" : "bg-secondary/60 border-border/50"
              )}>
                {/* Street name label - NORTH end (fixed anchor) */}
                <div className={cn(
                  "absolute top-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border",
                  
                  mapSource === "google-maps" ? "bg-white border-slate-300 text-slate-700" :
                  "bg-card/95 border-border text-foreground"
                )} style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "translateX(-50%) rotate(180deg)" }}>
                  S California Ave <span className="opacity-60 ml-1">↑</span>
                </div>
                {/* Street name label - SOUTH end (fixed anchor) */}
                <div className={cn(
                  "absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border",
                  
                  mapSource === "google-maps" ? "bg-white border-slate-300 text-slate-700" :
                  "bg-card/95 border-border text-foreground"
                )} style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "translateX(-50%) rotate(180deg)" }}>
                  <span className="opacity-60 mr-1">↓</span> S California Ave
                </div>
              </div>

              {/* S MOZART ST - Tertiary N-S Street (east cross street - fixed anchor) */}
              <div className={cn(
                "absolute left-[70%] -translate-x-1/2 h-full w-14 border-x transition-colors duration-500",
                displayMode === "night-vision" ? "bg-green-950/60 border-green-900/50" :
                mapSource === "satellite" ? "bg-slate-700/60 border-slate-600/50" : 
                mapSource === "google-earth" ? "bg-slate-800/60 border-slate-700/50" : 
                mapSource === "google-maps" ? "bg-slate-200/80 border-slate-300/60" :
                displayMode === "light" ? "bg-slate-400/60 border-slate-500/50" : "bg-secondary/60 border-border/50"
              )}>
                {/* Street name label - NORTH end (fixed anchor) */}
                <div className={cn(
                  "absolute top-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border",
                  
                  mapSource === "google-maps" ? "bg-white border-slate-300 text-slate-700" :
                  "bg-card/95 border-border text-foreground"
                )} style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "translateX(-50%) rotate(180deg)" }}>
                  S Mozart St <span className="opacity-60 ml-1">↑</span>
                </div>
                {/* Street name label - SOUTH end (fixed anchor) */}
                <div className={cn(
                  "absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border",
                  
                  mapSource === "google-maps" ? "bg-white border-slate-300 text-slate-700" :
                  "bg-card/95 border-border text-foreground"
                )} style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "translateX(-50%) rotate(180deg)" }}>
                  <span className="opacity-60 mr-1">↓</span> S Mozart St
                </div>
              </div>
              
              {/* Sidewalks along Marquette */}
              <div className={cn(
                "absolute top-1/2 -translate-y-[calc(50%+32px)] w-full h-3",
                
                mapSource === "google-maps" ? "bg-slate-300/70" :
                displayMode === "light" ? "bg-slate-300/60" : "bg-muted/40"
              )} />
              <div className={cn(
                "absolute top-1/2 translate-y-[calc(50%+20px)] w-full h-3",
                
                mapSource === "google-maps" ? "bg-slate-300/70" :
                displayMode === "light" ? "bg-slate-300/60" : "bg-muted/40"
              )} />

              {/* Cross Street Anchor Indicator - Shows fixed orientation */}
              <div className={cn(
                "absolute top-4 right-4 px-3 py-2 rounded-lg border text-[8px] font-medium",
                
                mapSource === "google-maps" ? "bg-white/95 border-slate-300 text-slate-600" :
                "bg-card/95 border-border text-muted-foreground"
              )}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn("w-2 h-2 rounded-full", "bg-safe")} />
                  <span>Cross Streets Locked</span>
                </div>
                <div className={cn("text-[7px] opacity-70", "")}>
                  Marquette × California/Mozart
                </div>
              </div>
            </div>

            {/* Main Fire Building */}
            <div className={cn("relative w-40 h-40 transition-opacity duration-300", isInterior && "opacity-60")}>
              {/* Building Base/First Floor */}
              <div 
                className={cn(
                  "absolute bottom-0 left-0 w-full h-20 border-2 transition-all duration-500",
                  displayMode === "night-vision" 
                    ? (currentEvent.fireStatus === "knocked" ? "border-green-600/60" : "border-green-500/60")
                    : (currentEvent.fireStatus === "knocked" ? "border-safe/60" : "border-fire/60")
                )}
                style={{
                  background: displayMode === "night-vision"
                    ? (currentEvent.fireStatus === "knocked" 
                      ? "linear-gradient(135deg, rgba(0, 100, 0, 0.3) 0%, rgba(0, 80, 0, 0.4) 100%)"
                      : "linear-gradient(135deg, rgba(0, 80, 0, 0.3) 0%, rgba(0, 60, 0, 0.4) 100%)")
                    : (currentEvent.fireStatus === "knocked" 
                      ? "linear-gradient(135deg, rgba(100, 150, 100, 0.2) 0%, rgba(80, 120, 80, 0.3) 100%)"
                      : "linear-gradient(135deg, rgba(200, 80, 60, 0.3) 0%, rgba(150, 50, 30, 0.4) 100%)"),
                  boxShadow: displayMode === "night-vision"
                    ? "inset 0 0 20px rgba(0, 200, 0, 0.2)"
                    : (currentEvent.fireStatus === "knocked"
                      ? "inset 0 0 20px rgba(100, 200, 100, 0.2)"
                      : "inset 0 0 30px rgba(255, 100, 50, 0.3), 0 0 40px rgba(255, 80, 30, 0.4)")
                }}
              >
                {/* Windows */}
                <div className={cn(
                  "absolute top-2 left-2 w-6 h-8 border transition-all duration-500",
                  displayMode === "night-vision"
                    ? (currentEvent.fireStatus === "knocked" ? "bg-green-800/30 border-green-600/50" : "bg-green-700/50 border-green-500/70 animate-pulse")
                    : (currentEvent.fireStatus === "knocked" ? "bg-safe/30 border-safe/50" : "bg-fire/50 border-fire/70 animate-pulse")
                )} />
                <div className={cn(
                  "absolute top-2 left-10 w-6 h-8 border transition-all duration-500",
                  displayMode === "night-vision"
                    ? (currentEvent.fireStatus === "knocked" ? "bg-green-800/30 border-green-600/50" : "bg-green-700/50 border-green-500/70 animate-pulse")
                    : (currentEvent.fireStatus === "knocked" ? "bg-safe/30 border-safe/50" : "bg-fire/50 border-fire/70 animate-pulse")
                )} style={{ animationDelay: "0.3s" }} />
                <div className={cn(
                  "absolute top-2 right-2 w-8 h-10 border",
                  
                  displayMode === "light" ? "bg-slate-400/40 border-slate-500/50" : "bg-secondary/40 border-border/50"
                )} /> {/* Door */}
              </div>

              {/* Second Floor */}
              <div 
                className={cn(
                  "absolute bottom-20 left-0 w-full h-16 border-2 border-t-0 transition-all duration-500",
                  displayMode === "night-vision"
                    ? (currentEvent.fireStatus === "knocked" ? "border-green-600/60" : "border-green-500/80")
                    : (currentEvent.fireStatus === "knocked" ? "border-safe/60" : "border-fire/80")
                )}
                style={{
                  background: displayMode === "night-vision"
                    ? (currentEvent.fireStatus === "knocked"
                      ? "linear-gradient(135deg, rgba(0, 120, 0, 0.3) 0%, rgba(0, 100, 0, 0.4) 100%)"
                      : "linear-gradient(135deg, rgba(0, 100, 0, 0.4) 0%, rgba(0, 80, 0, 0.5) 100%)")
                    : (currentEvent.fireStatus === "knocked"
                      ? "linear-gradient(135deg, rgba(100, 180, 100, 0.3) 0%, rgba(80, 140, 80, 0.4) 100%)"
                      : "linear-gradient(135deg, rgba(255, 100, 50, 0.4) 0%, rgba(200, 60, 20, 0.5) 100%)"),
                  boxShadow: displayMode === "night-vision"
                    ? "inset 0 0 30px rgba(0, 200, 0, 0.3)"
                    : (currentEvent.fireStatus === "knocked"
                      ? "inset 0 0 30px rgba(100, 200, 100, 0.3)"
                      : "inset 0 0 40px rgba(255, 120, 60, 0.5), 0 0 60px rgba(255, 80, 30, 0.6)")
                }}
              >
                {/* Windows with fire */}
                {currentEvent.fireStatus !== "knocked" ? (
                  <>
                    <div className={cn(
                      "absolute top-2 left-2 w-6 h-7 border animate-pulse",
                      "bg-fire border-fire-glow"
                    )}>
                      <div className={cn(
                        "absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 blur-sm animate-bounce",
                        "bg-fire-glow/80"
                      )} style={{ animationDuration: "0.5s" }} />
                    </div>
                    <div className={cn(
                      "absolute top-2 left-10 w-6 h-7 border animate-pulse",
                      "bg-fire/80 border-fire-glow"
                    )} style={{ animationDelay: "0.2s" }}>
                      <div className={cn(
                        "absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 blur-md animate-bounce",
                        "bg-fire-glow/70"
                      )} style={{ animationDuration: "0.6s" }} />
                    </div>
                    <div className={cn(
                      "absolute top-2 right-2 w-6 h-7 border animate-pulse",
                      "bg-fire/60 border-fire/70"
                    )} style={{ animationDelay: "0.4s" }} />
                  </>
                ) : (
                  <>
                    <div className={cn(
                      "absolute top-2 left-2 w-6 h-7 border",
                      "bg-safe/40 border-safe/60"
                    )} />
                    <div className={cn(
                      "absolute top-2 left-10 w-6 h-7 border",
                      "bg-safe/40 border-safe/60"
                    )} />
                    <div className={cn(
                      "absolute top-2 right-2 w-6 h-7 border",
                      "bg-safe/40 border-safe/60"
                    )} />
                  </>
                )}
              </div>

              {/* Roof */}
              <div 
                className={cn(
                  "absolute bottom-36 left-0 w-full h-4 border-2",
                  displayMode === "night-vision" 
                    ? (isRoofView ? "bg-green-900/80 border-green-500" : "bg-green-950 border-green-800/60")
                    : (isRoofView ? "bg-muted/80 border-accent" : "bg-muted border-border/60")
                )}
                style={{ transform: "translateY(-1px)" }}
              >
                {/* Roof opening indicator */}
                <div className={cn(
                  "absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 border",
                  "bg-hazard/40 border-hazard/60"
                )}>
                  <span className={cn(
                    "text-[6px] font-bold absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap",
                    "text-hazard"
                  )}>VENT</span>
                </div>
              </div>

              {/* Smoke Effect - only show when fire not knocked */}
              {currentEvent.fireStatus !== "knocked" && (
                <div className="absolute -top-16 left-1/4 w-20 h-20">
                  <div className={cn(
                    "absolute w-10 h-10 rounded-full blur-xl animate-pulse",
                    "bg-muted-foreground/30"
                  )} />
                  <div className={cn(
                    "absolute left-4 top-4 w-8 h-8 rounded-full blur-lg animate-pulse",
                    "bg-muted-foreground/20"
                  )} style={{ animationDelay: "0.5s" }} />
                  <div className={cn(
                    "absolute left-2 top-8 w-6 h-6 rounded-full blur-md animate-pulse",
                    "bg-muted-foreground/15"
                  )} style={{ animationDelay: "1s" }} />
                </div>
              )}

              {/* Interior View Overlay */}
              {isInterior && (
                <div className={cn(
                  "absolute inset-0 border-2 rounded",
                  "border-accent/60 bg-accent/10"
                )}>
                  <div className="absolute inset-2 grid grid-cols-2 grid-rows-2 gap-1">
                    <div className={cn(
                      "border flex items-center justify-center",
                      "bg-fire/20 border-fire/40"
                    )}>
                      <span className={cn(
                        "text-[7px] font-bold",
                        "text-fire"
                      )}>FIRE</span>
                    </div>
                    <div className={cn(
                      "border flex items-center justify-center",
                      "bg-secondary/40 border-border/40"
                    )}>
                      <span className={cn("text-[7px]", styles.mutedText)}>ROOM</span>
                    </div>
                    <div className={cn(
                      "border flex items-center justify-center",
                      "bg-safe/20 border-safe/40"
                    )}>
                      <span className={cn(
                        "text-[7px] font-bold",
                        "text-safe"
                      )}>CLEAR</span>
                    </div>
                    <div className={cn(
                      "border flex items-center justify-center",
                      "bg-hazard/20 border-hazard/40"
                    )}>
                      <span className={cn(
                        "text-[7px]",
                        "text-hazard"
                      )}>SEARCH</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Collapse Zone */}
            <div 
              className={cn(
                "absolute -bottom-8 -left-8 w-56 h-56 border-2 border-dashed rounded-lg",
                "border-hazard/60"
              )}
              style={{ transform: "translateZ(-2px)" }}
            >
              <span className={cn(
                "absolute bottom-1 right-2 text-[8px] font-bold uppercase tracking-wider",
                "text-hazard"
              )}>Collapse Zone</span>
            </div>

            {/* Fire Apparatus - Engine 78 (positioned on W Marquette Rd in front - Alpha side) */}
            <div className={cn(
              "absolute -bottom-20 left-1/2 -translate-x-1/2 w-20 h-8 border rounded-sm",
              "bg-fire/80 border-fire glow-fire"
            )} style={{ transform: "translateX(-50%) translateY(20px)" }}>
              <span className={cn(
                "absolute -top-4 left-1/2 -translate-x-1/2 text-[7px] font-bold whitespace-nowrap",
                "text-fire"
              )}>ENGINE 78</span>
              <div className={cn(
                "absolute top-1 left-1 w-3 h-2 rounded-sm",
                "bg-fire-glow/60"
              )} />
              <div className={cn(
                "absolute top-1 right-1 w-3 h-2 rounded-sm",
                "bg-fire-glow/60"
              )} />
            </div>

            {/* Truck 23 (positioned on California Ave - west of scene) */}
            <div className={cn(
              "absolute -bottom-32 left-1/4 w-24 h-7 border rounded-sm",
              "bg-fire/80 border-fire glow-fire"
            )} style={{ transform: "translateY(20px)" }}>
              <span className={cn(
                "absolute -top-4 left-1/2 -translate-x-1/2 text-[7px] font-bold whitespace-nowrap",
                "text-fire"
              )}>TRUCK 23</span>
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 left-2 w-16 h-1",
                "bg-fire-glow/40"
              )} />
            </div>

            {/* Hose Lines */}
            <svg className="absolute -bottom-16 left-0 w-full h-32 pointer-events-none" style={{ transform: "translateZ(1px) translateY(20px)" }}>
              {/* Main attack line - from Engine to building Alpha side */}
              <path 
                d={`M 80 100 Q 60 80, 70 50 T 80 20`}
                fill="none"
                stroke={"rgba(80, 150, 255, 0.8)"}
                strokeWidth="4"
                strokeLinecap="round"
                className="drop-shadow-[0_0_4px_rgba(80,150,255,0.6)]"
              />
              {/* Supply line - from hydrant to engine */}
              <path 
                d={`M 120 120 L 80 110`}
                fill="none"
                stroke={"rgba(100, 180, 100, 0.6)"}
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>

            {/* Hydrant - on Marquette Rd east of scene */}
            <div className={cn(
              "absolute -bottom-36 right-1/4 w-4 h-6 rounded-t border-2",
              "bg-water border-water-glow"
            )} style={{ transform: "translateY(20px)" }}>
              <div className={cn(
                "absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 rounded",
                "bg-water"
              )} />
              <span className={cn(
                "absolute -bottom-4 left-1/2 -translate-x-1/2 text-[6px] font-bold whitespace-nowrap",
                "text-water"
              )}>HYD</span>
            </div>

            {/* Firefighter Team Markers */}
            {/* A1 = Attack team Alpha side, V1 = Ventilation, R = Roof team */}
            <div className={cn(
              "absolute -bottom-4 left-8 w-5 h-5 rounded-full border-2 flex items-center justify-center",
              "bg-safe border-safe-glow"
            )} style={{ transform: "translateY(20px)" }}>
              <span className={cn("text-[6px] font-bold", "text-safe-glow")}>A1</span>
            </div>
            <div className={cn(
              "absolute top-12 -right-8 w-5 h-5 rounded-full border-2 flex items-center justify-center",
              "bg-safe border-safe-glow"
            )} style={{ transform: "translateY(20px)" }}>
              <span className={cn("text-[6px] font-bold", "text-safe-glow")}>V1</span>
            </div>
            <div className={cn(
              "absolute -top-4 left-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center",
              "bg-hazard border-hazard-glow animate-pulse"
            )} style={{ transform: "translateX(-50%) translateY(20px)" }}>
              <span className={cn("text-[6px] font-bold", "text-hazard-glow")}>R</span>
            </div>

            {/* Side Labels - Alpha=North (street), Bravo=West, Charlie=South (rear), Delta=East */}
            <div className={cn(
              "absolute -bottom-14 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border",
              "bg-card/80 border-border text-foreground"
            )} style={{ transform: "translateX(-50%) translateY(20px)" }}>Alpha (Street)</div>
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 -left-20 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border",
              "bg-card/80 border-border text-foreground"
            )} style={{ transform: "translateY(20px)" }}>Bravo</div>
            <div className={cn(
              "absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border",
              "bg-card/80 border-border text-foreground"
            )} style={{ transform: "translateX(-50%) translateY(20px)" }}>Charlie (Rear)</div>
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 -right-16 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border",
              "bg-card/80 border-border text-foreground"
            )} style={{ transform: "translateY(20px)" }}>Delta</div>
          </div>
        </div>
      </div>

      {/* Floor Tactical Notes - Shows when in Floor View mode */}
      <FloorTacticalNotes />
    </div>
  )
}
