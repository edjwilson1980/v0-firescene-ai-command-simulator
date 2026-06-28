"use client"

import { Users, AlertTriangle, Flame, Search, Wrench } from "lucide-react"
import { useSimulation, FloorView } from "./simulation-context"
import { cn } from "@/lib/utils"

interface FloorInfo {
  id: FloorView
  displayName: string
  companies: string[]
  hazards: string[]
  fireConditions: string
  victimStatus: string
  searchStatus: string
  equipment: string[]
}

// Mock floor data
const floorData: Record<FloorView, FloorInfo> = {
  basement: {
    id: "basement",
    displayName: "Basement",
    companies: ["Engine 12", "Truck 5"],
    hazards: ["Heavy smoke", "Limited access", "Hydraulic fluid"],
    fireConditions: "Active fire, NE corner",
    victimStatus: "No known victims",
    searchStatus: "Not yet searched",
    equipment: ["2.5\" hose", "Ladder"],
  },
  floor1: {
    id: "floor1",
    displayName: "Floor 1",
    companies: ["Engine 12", "Engine 78"],
    hazards: ["Smoke logged", "Active fire"],
    fireConditions: "Fire knocked down, still smoldering",
    victimStatus: "1 victim rescued",
    searchStatus: "Primary search complete",
    equipment: ["Attack line", "Ventilation fan"],
  },
  floor2: {
    id: "floor2",
    displayName: "Floor 2",
    companies: ["Truck 5", "Truck 23", "Engine 84"],
    hazards: ["Heavy fire", "Structural compromise"],
    fireConditions: "Active fire, rear bedroom",
    victimStatus: "Search in progress",
    searchStatus: "Primary in progress",
    equipment: ["Roof ladder", "Saw"],
  },
  floor3: {
    id: "floor3",
    displayName: "Floor 3",
    companies: ["Battalion 18"],
    hazards: ["Light smoke"],
    fireConditions: "Minimal fire involvement",
    victimStatus: "Clear",
    searchStatus: "Primary search complete",
    equipment: ["Standby"],
  },
  attic: {
    id: "attic",
    displayName: "Attic",
    companies: ["Truck 5"],
    hazards: ["Roof compromise", "Access limited"],
    fireConditions: "Potential extension threat",
    victimStatus: "N/A",
    searchStatus: "Venting in progress",
    equipment: ["Roof ladder", "Ventilation"],
  },
  roof: {
    id: "roof",
    displayName: "Roof",
    companies: ["Truck 5", "Truck 9"],
    hazards: ["Structural damage", "Active fire below"],
    fireConditions: "Roof vent holes cut",
    victimStatus: "N/A",
    searchStatus: "Ventilation complete",
    equipment: ["Roof ladder", "Saw", "Pike pole"],
  },
}

export function FloorTacticalNotes() {
  const { viewMode, selectedFloor, displayMode, mapSource } = useSimulation()

  if (viewMode !== "floor" || mapSource !== "tactical") {
    return null
  }

  const floor = floorData[selectedFloor]

  const getDisplayModeStyles = () => {
    switch (displayMode) {
      case "light":
        return {
          containerBg: "bg-white/95 border-slate-300",
          textColor: "text-slate-900",
          mutedText: "text-slate-600",
          headerBg: "bg-slate-100 border-slate-200",
          cardBg: "bg-slate-50 border-slate-200",
          activeBg: "bg-slate-100 border-slate-300",
        }
      default:
        return {
          containerBg: "bg-card/90 border-border",
          textColor: "text-foreground",
          mutedText: "text-muted-foreground",
          headerBg: "bg-secondary/50 border-border",
          cardBg: "bg-secondary/30 border-border",
          activeBg: "bg-secondary border-border",
        }
    }
  }

  const styles = getDisplayModeStyles()

  return (
    <div className={cn("absolute bottom-4 right-4 w-80 z-20 rounded-lg border overflow-hidden shadow-lg", styles.containerBg)}>
      {/* Header */}
      <div className={cn("p-3 border-b", styles.headerBg)}>
        <h3 className={cn("text-sm font-bold uppercase tracking-wide", styles.textColor)}>
          {floor.displayName} Tactical Notes
        </h3>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
        {/* Companies */}
        <div>
          <div className={cn("flex items-center gap-2 text-[10px] uppercase font-semibold mb-1.5", styles.mutedText)}>
            <Users className="w-3 h-3" />
            Units on Floor
          </div>
          <div className="flex flex-wrap gap-1">
            {floor.companies.map((company) => (
              <span
                key={company}
                className={cn("px-2 py-1 rounded text-[9px] font-medium border", styles.cardBg, styles.textColor)}
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        {/* Fire Conditions */}
        <div>
          <div className={cn("flex items-center gap-2 text-[10px] uppercase font-semibold mb-1.5 text-fire")}>
            <Flame className="w-3 h-3" />
            Fire Conditions
          </div>
          <p className={cn("text-[9px] leading-relaxed", styles.textColor)}>
            {floor.fireConditions}
          </p>
        </div>

        {/* Hazards */}
        <div>
          <div className={cn("flex items-center gap-2 text-[10px] uppercase font-semibold mb-1.5 text-hazard")}>
            <AlertTriangle className="w-3 h-3" />
            Hazards
          </div>
          <ul className="space-y-0.5">
            {floor.hazards.map((hazard, idx) => (
              <li key={idx} className={cn("text-[9px] ml-3 list-disc", styles.textColor)}>
                {hazard}
              </li>
            ))}
          </ul>
        </div>

        {/* Search Status */}
        <div>
          <div className={cn("flex items-center gap-2 text-[10px] uppercase font-semibold mb-1.5 text-safe")}>
            <Search className="w-3 h-3" />
            Search Status
          </div>
          <p className={cn("text-[9px]", styles.textColor)}>
            {floor.searchStatus}
          </p>
        </div>

        {/* Victim Status */}
        <div>
          <div className={cn("flex items-center gap-2 text-[10px] uppercase font-semibold mb-1.5 text-accent")}>
            <Users className="w-3 h-3" />
            Victims
          </div>
          <p className={cn("text-[9px]", styles.textColor)}>
            {floor.victimStatus}
          </p>
        </div>

        {/* Equipment */}
        <div>
          <div className={cn("flex items-center gap-2 text-[10px] uppercase font-semibold mb-1.5 text-radio")}>
            <Wrench className="w-3 h-3" />
            Equipment Deployed
          </div>
          <ul className="space-y-0.5">
            {floor.equipment.map((item, idx) => (
              <li key={idx} className={cn("text-[9px] ml-3 list-disc", styles.textColor)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
