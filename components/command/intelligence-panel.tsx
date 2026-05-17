"use client"

import { Building2, RotateCcw, ZoomIn, Layers, Eye, Box, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const structureData = [
  { label: "Building Type", value: "Ordinary Construction" },
  { label: "Occupancy", value: "Multi-Family Residential" },
  { label: "Dimensions", value: "40' × 60' × 28'" },
  { label: "Floors", value: "2 Stories + Basement" },
  { label: "Roof Type", value: "Flat / Built-up" },
  { label: "Fire Location", value: "2nd Floor, Alpha Side" },
  { label: "Exposure Risk", value: "Moderate (B & D)" },
  { label: "Water Supply", value: "Hydrant 50' - Good Flow" },
]

export function IntelligencePanel() {
  return (
    <div className="w-72 flex flex-col tactical-card overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center gap-2">
        <Building2 className="w-4 h-4 text-accent" />
        <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Structure Intel</span>
      </div>

      {/* Structure Data */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Data Cards */}
        <div className="space-y-2">
          {structureData.map((item) => (
            <div key={item.label} className="flex justify-between items-center py-1.5 px-2 rounded bg-secondary/50 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</span>
              <span className="text-xs text-foreground font-medium text-right">{item.value}</span>
            </div>
          ))}
        </div>

        {/* 3D Building Preview */}
        <div className="tactical-glass rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">3D Preview</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <RotateCcw className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ZoomIn className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Isometric Building Preview */}
          <div className="relative h-32 bg-background/50 rounded border border-border overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "400px" }}>
              <div 
                className="relative w-20 h-20"
                style={{ 
                  transform: "rotateX(60deg) rotateZ(-45deg)",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Base */}
                <div className="absolute bottom-0 w-full h-10 bg-secondary border border-border" />
                {/* Second Floor */}
                <div className="absolute bottom-10 w-full h-8 bg-fire/40 border border-fire/60" 
                  style={{ boxShadow: "inset 0 0 20px rgba(255, 100, 50, 0.4)" }}
                />
                {/* Roof */}
                <div className="absolute bottom-[72px] w-full h-2 bg-muted border border-border" />
              </div>
            </div>

            {/* Floor Indicator */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              <button className="w-5 h-5 flex items-center justify-center rounded bg-secondary border border-border hover:bg-accent/20 transition-colors">
                <ChevronUp className="w-3 h-3 text-muted-foreground" />
              </button>
              <div className="px-1.5 py-0.5 bg-fire/20 border border-fire/40 rounded text-center">
                <span className="text-[8px] text-fire font-bold">F2</span>
              </div>
              <div className="px-1.5 py-0.5 bg-secondary border border-border rounded text-center">
                <span className="text-[8px] text-muted-foreground">F1</span>
              </div>
              <div className="px-1.5 py-0.5 bg-secondary border border-border rounded text-center">
                <span className="text-[8px] text-muted-foreground">B</span>
              </div>
              <button className="w-5 h-5 flex items-center justify-center rounded bg-secondary border border-border hover:bg-accent/20 transition-colors">
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex gap-1 mt-2">
            <Button variant="secondary" size="sm" className="flex-1 h-7 text-[10px]">
              <Layers className="w-3 h-3 mr-1" />
              Slice
            </Button>
            <Button variant="secondary" size="sm" className="flex-1 h-7 text-[10px]">
              <Eye className="w-3 h-3 mr-1" />
              X-Ray
            </Button>
            <Button variant="secondary" size="sm" className="flex-1 h-7 text-[10px]">
              <Box className="w-3 h-3 mr-1" />
              Interior
            </Button>
          </div>
        </div>

        {/* Hazard Alerts */}
        <div className="space-y-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Active Hazards</span>
          <div className="p-2 rounded bg-fire/10 border border-fire/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fire animate-pulse" />
              <span className="text-[11px] text-fire font-medium">Fire - 2nd Floor Alpha</span>
            </div>
          </div>
          <div className="p-2 rounded bg-hazard/10 border border-hazard/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-hazard animate-pulse" />
              <span className="text-[11px] text-hazard font-medium">Collapse Risk - Front Porch</span>
            </div>
          </div>
          <div className="p-2 rounded bg-muted border border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">Utilities - Gas Secured</span>
            </div>
          </div>
        </div>

        {/* Search Status */}
        <div className="space-y-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Search Status</span>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="p-1.5 rounded bg-safe/10 border border-safe/30 text-center">
              <span className="text-[9px] text-safe font-medium block">F2 Primary</span>
              <span className="text-[8px] text-safe/70">COMPLETE</span>
            </div>
            <div className="p-1.5 rounded bg-hazard/10 border border-hazard/30 text-center">
              <span className="text-[9px] text-hazard font-medium block">F1 Primary</span>
              <span className="text-[8px] text-hazard/70">IN PROGRESS</span>
            </div>
            <div className="p-1.5 rounded bg-secondary border border-border text-center">
              <span className="text-[9px] text-muted-foreground font-medium block">F2 Secondary</span>
              <span className="text-[8px] text-muted-foreground/70">PENDING</span>
            </div>
            <div className="p-1.5 rounded bg-secondary border border-border text-center">
              <span className="text-[9px] text-muted-foreground font-medium block">Basement</span>
              <span className="text-[8px] text-muted-foreground/70">PENDING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
