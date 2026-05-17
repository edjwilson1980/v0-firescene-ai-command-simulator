"use client"

import { useState } from "react"
import { Plus, AlertTriangle, Camera, Users, RotateCcw, Download, X, Truck, Droplets, Radio, Ambulance } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSimulation } from "./simulation-context"
import { cn } from "@/lib/utils"

// Units on scene derived from radio traffic
const unitsOnScene = {
  engines: [
    { unit: "Engine 78", assignment: "Attack", status: "Working" },
    { unit: "Engine 84", assignment: "Water Supply", status: "Working" },
  ],
  trucks: [
    { unit: "Truck 23", assignment: "Ventilation/Search", status: "Working" },
    { unit: "Truck 9", assignment: "RIT", status: "Standby" },
  ],
  battalionChiefs: [
    { unit: "Battalion 18", assignment: "Command", status: "IC" },
  ],
  ambulances: [
    { unit: "Ambulance 42", assignment: "EMS Staging", status: "Staged" },
  ],
}

const actions = [
  { icon: Plus, label: "Add Unit", variant: "default" as const, action: "addUnit" },
  { icon: AlertTriangle, label: "Add Hazard", variant: "destructive" as const, action: "addHazard" },
  { icon: Camera, label: "Snapshot", variant: "secondary" as const, action: "snapshot" },
  { icon: Users, label: "PAR Check", variant: "default" as const, action: "parCheck" },
  { icon: RotateCcw, label: "Replay", variant: "secondary" as const, action: "replay" },
  { icon: Download, label: "Export", variant: "secondary" as const, action: "export" },
]

export function CommandActions() {
  const { displayMode } = useSimulation()
  const [showPARModal, setShowPARModal] = useState(false)

  const getDisplayModeStyles = () => {
    switch (displayMode) {
      case "light":
        return {
          containerBg: "bg-white/95 border-slate-300",
          textColor: "text-slate-600",
          defaultBtn: "bg-cyan-600 hover:bg-cyan-700 text-white",
          secondaryBtn: "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300",
          destructiveBtn: "bg-red-100 hover:bg-red-200 text-red-700 border-red-300",
          modalBg: "bg-white border-slate-300",
          cardBg: "bg-slate-100 border-slate-200",
          headerText: "text-slate-900",
          mutedText: "text-slate-600",
          categoryBg: "bg-slate-50",
          workingBg: "bg-emerald-100 text-emerald-700",
          standbyBg: "bg-amber-100 text-amber-700",
          icBg: "bg-purple-100 text-purple-700",
          stagedBg: "bg-cyan-100 text-cyan-700",
        }
      case "night-vision":
        return {
          containerBg: "bg-black/95 border-green-900",
          textColor: "text-green-600",
          defaultBtn: "bg-green-800 hover:bg-green-700 text-green-200",
          secondaryBtn: "bg-green-950 hover:bg-green-900/80 text-green-400 border-green-800",
          destructiveBtn: "bg-green-900/50 hover:bg-green-800/50 text-green-300 border-green-700",
          modalBg: "bg-black border-green-800",
          cardBg: "bg-green-950/50 border-green-900",
          headerText: "text-green-400",
          mutedText: "text-green-600",
          categoryBg: "bg-green-950/30",
          workingBg: "bg-green-900/50 text-green-300",
          standbyBg: "bg-green-800/40 text-green-400",
          icBg: "bg-green-900/60 text-green-300",
          stagedBg: "bg-green-900/40 text-green-400",
        }
      default:
        return {
          containerBg: "bg-card/90 border-border",
          textColor: "text-muted-foreground",
          defaultBtn: "",
          secondaryBtn: "",
          destructiveBtn: "bg-fire/20 hover:bg-fire/30 text-fire border-fire/30",
          modalBg: "bg-card border-border",
          cardBg: "bg-secondary/50 border-border",
          headerText: "text-foreground",
          mutedText: "text-muted-foreground",
          categoryBg: "bg-secondary/30",
          workingBg: "bg-safe/20 text-safe",
          standbyBg: "bg-hazard/20 text-hazard",
          icBg: "bg-radio/20 text-radio",
          stagedBg: "bg-accent/20 text-accent",
        }
    }
  }

  const styles = getDisplayModeStyles()

  const getButtonStyle = (variant: "default" | "secondary" | "destructive") => {
    if (displayMode === "dark") {
      if (variant === "destructive") return styles.destructiveBtn
      return ""
    }
    if (variant === "default") return styles.defaultBtn
    if (variant === "secondary") return styles.secondaryBtn
    if (variant === "destructive") return styles.destructiveBtn
    return ""
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Working": return styles.workingBg
      case "Standby": return styles.standbyBg
      case "IC": return styles.icBg
      case "Staged": return styles.stagedBg
      default: return styles.cardBg
    }
  }

  const handleAction = (action: string) => {
    if (action === "parCheck") {
      setShowPARModal(true)
    }
  }

  const totalUnits = unitsOnScene.engines.length + unitsOnScene.trucks.length + 
                     unitsOnScene.battalionChiefs.length + unitsOnScene.ambulances.length

  return (
    <>
      <div className={cn("flex items-center gap-2 px-4 py-2 border-t", styles.containerBg)}>
        <span className={cn("text-[10px] uppercase tracking-wider mr-2", styles.textColor)}>Quick Actions</span>
        {actions.map((action) => (
          <Button 
            key={action.label}
            variant={displayMode === "dark" ? action.variant : "secondary"}
            size="sm"
            className={cn("h-8 text-xs gap-1.5", getButtonStyle(action.variant))}
            onClick={() => handleAction(action.action)}
          >
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* PAR Check Modal */}
      {showPARModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={cn("w-[500px] max-h-[80vh] overflow-hidden rounded-lg border shadow-2xl", styles.modalBg)}>
            {/* Modal Header */}
            <div className={cn("flex items-center justify-between p-4 border-b", styles.cardBg)}>
              <div className="flex items-center gap-3">
                <Users className={cn("w-5 h-5", displayMode === "night-vision" ? "text-green-400" : displayMode === "light" ? "text-cyan-600" : "text-accent")} />
                <div>
                  <h2 className={cn("text-lg font-bold", styles.headerText)}>PAR Check - Units On Scene</h2>
                  <p className={cn("text-xs", styles.mutedText)}>Personnel Accountability Report</p>
                </div>
              </div>
              <button
                onClick={() => setShowPARModal(false)}
                className={cn("p-2 rounded hover:bg-secondary/50", displayMode === "night-vision" && "hover:bg-green-900/50")}
              >
                <X className={cn("w-5 h-5", styles.mutedText)} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Summary */}
              <div className={cn("p-3 rounded-lg border text-center", styles.cardBg)}>
                <span className={cn("text-[10px] uppercase tracking-wide block mb-1", styles.mutedText)}>Total Units On Scene</span>
                <span className={cn("text-3xl font-bold", styles.headerText)}>{totalUnits}</span>
              </div>

              {/* Engines */}
              <div className={cn("rounded-lg border overflow-hidden", styles.cardBg)}>
                <div className={cn("flex items-center gap-2 px-3 py-2 border-b", styles.categoryBg)}>
                  <Droplets className={cn("w-4 h-4", displayMode === "night-vision" ? "text-green-400" : displayMode === "light" ? "text-blue-600" : "text-water")} />
                  <span className={cn("text-sm font-semibold uppercase", styles.headerText)}>Engines ({unitsOnScene.engines.length})</span>
                </div>
                <div className="divide-y divide-border/50">
                  {unitsOnScene.engines.map((unit) => (
                    <div key={unit.unit} className="flex items-center justify-between px-3 py-2">
                      <div>
                        <span className={cn("text-sm font-medium", styles.headerText)}>{unit.unit}</span>
                        <span className={cn("text-xs ml-2", styles.mutedText)}>{unit.assignment}</span>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusBadge(unit.status))}>
                        {unit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trucks */}
              <div className={cn("rounded-lg border overflow-hidden", styles.cardBg)}>
                <div className={cn("flex items-center gap-2 px-3 py-2 border-b", styles.categoryBg)}>
                  <Truck className={cn("w-4 h-4", displayMode === "night-vision" ? "text-green-400" : displayMode === "light" ? "text-amber-600" : "text-hazard")} />
                  <span className={cn("text-sm font-semibold uppercase", styles.headerText)}>Trucks ({unitsOnScene.trucks.length})</span>
                </div>
                <div className="divide-y divide-border/50">
                  {unitsOnScene.trucks.map((unit) => (
                    <div key={unit.unit} className="flex items-center justify-between px-3 py-2">
                      <div>
                        <span className={cn("text-sm font-medium", styles.headerText)}>{unit.unit}</span>
                        <span className={cn("text-xs ml-2", styles.mutedText)}>{unit.assignment}</span>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusBadge(unit.status))}>
                        {unit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Battalion Chiefs */}
              <div className={cn("rounded-lg border overflow-hidden", styles.cardBg)}>
                <div className={cn("flex items-center gap-2 px-3 py-2 border-b", styles.categoryBg)}>
                  <Radio className={cn("w-4 h-4", displayMode === "night-vision" ? "text-green-400" : displayMode === "light" ? "text-purple-600" : "text-radio")} />
                  <span className={cn("text-sm font-semibold uppercase", styles.headerText)}>Battalion Chiefs ({unitsOnScene.battalionChiefs.length})</span>
                </div>
                <div className="divide-y divide-border/50">
                  {unitsOnScene.battalionChiefs.map((unit) => (
                    <div key={unit.unit} className="flex items-center justify-between px-3 py-2">
                      <div>
                        <span className={cn("text-sm font-medium", styles.headerText)}>{unit.unit}</span>
                        <span className={cn("text-xs ml-2", styles.mutedText)}>{unit.assignment}</span>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusBadge(unit.status))}>
                        {unit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ambulances */}
              <div className={cn("rounded-lg border overflow-hidden", styles.cardBg)}>
                <div className={cn("flex items-center gap-2 px-3 py-2 border-b", styles.categoryBg)}>
                  <Ambulance className={cn("w-4 h-4", displayMode === "night-vision" ? "text-green-400" : displayMode === "light" ? "text-cyan-600" : "text-accent")} />
                  <span className={cn("text-sm font-semibold uppercase", styles.headerText)}>Ambulances ({unitsOnScene.ambulances.length})</span>
                </div>
                <div className="divide-y divide-border/50">
                  {unitsOnScene.ambulances.map((unit) => (
                    <div key={unit.unit} className="flex items-center justify-between px-3 py-2">
                      <div>
                        <span className={cn("text-sm font-medium", styles.headerText)}>{unit.unit}</span>
                        <span className={cn("text-xs ml-2", styles.mutedText)}>{unit.assignment}</span>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusBadge(unit.status))}>
                        {unit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={cn("flex items-center justify-between p-4 border-t", styles.cardBg)}>
              <span className={cn("text-xs", styles.mutedText)}>Last PAR: 14:30</span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className={cn(
                    "h-8 text-xs",
                    displayMode === "night-vision" && "bg-green-950 border-green-800 text-green-400 hover:bg-green-900/50",
                    displayMode === "light" && "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                  )}
                  onClick={() => setShowPARModal(false)}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className={cn(
                    "h-8 text-xs",
                    displayMode === "night-vision" && "bg-green-800 hover:bg-green-700 text-green-200",
                    displayMode === "light" && "bg-cyan-600 hover:bg-cyan-700 text-white"
                  )}
                >
                  Initiate PAR
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
