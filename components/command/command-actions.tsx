"use client"

import { Plus, AlertTriangle, Camera, Users, RotateCcw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSimulation } from "./simulation-context"
import { cn } from "@/lib/utils"

const actions = [
  { icon: Plus, label: "Add Unit", variant: "default" as const },
  { icon: AlertTriangle, label: "Add Hazard", variant: "destructive" as const },
  { icon: Camera, label: "Snapshot", variant: "secondary" as const },
  { icon: Users, label: "PAR Check", variant: "default" as const },
  { icon: RotateCcw, label: "Replay", variant: "secondary" as const },
  { icon: Download, label: "Export", variant: "secondary" as const },
]

export function CommandActions() {
  const { displayMode } = useSimulation()

  const getDisplayModeStyles = () => {
    switch (displayMode) {
      case "light":
        return {
          containerBg: "bg-white/95 border-slate-300",
          textColor: "text-slate-600",
          defaultBtn: "bg-cyan-600 hover:bg-cyan-700 text-white",
          secondaryBtn: "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300",
          destructiveBtn: "bg-red-100 hover:bg-red-200 text-red-700 border-red-300",
        }
      case "night-vision":
        return {
          containerBg: "bg-black/95 border-green-900",
          textColor: "text-green-600",
          defaultBtn: "bg-green-800 hover:bg-green-700 text-green-200",
          secondaryBtn: "bg-green-950 hover:bg-green-900/80 text-green-400 border-green-800",
          destructiveBtn: "bg-green-900/50 hover:bg-green-800/50 text-green-300 border-green-700",
        }
      default:
        return {
          containerBg: "bg-card/90 border-border",
          textColor: "text-muted-foreground",
          defaultBtn: "",
          secondaryBtn: "",
          destructiveBtn: "bg-fire/20 hover:bg-fire/30 text-fire border-fire/30",
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

  return (
    <div className={cn("flex items-center gap-2 px-4 py-2 border-t", styles.containerBg)}>
      <span className={cn("text-[10px] uppercase tracking-wider mr-2", styles.textColor)}>Quick Actions</span>
      {actions.map((action) => (
        <Button 
          key={action.label}
          variant={displayMode === "dark" ? action.variant : "secondary"}
          size="sm"
          className={cn("h-8 text-xs gap-1.5", getButtonStyle(action.variant))}
        >
          <action.icon className="w-3.5 h-3.5" />
          {action.label}
        </Button>
      ))}
    </div>
  )
}
