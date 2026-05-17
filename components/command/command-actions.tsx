"use client"

import { Plus, AlertTriangle, Camera, Users, RotateCcw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const actions = [
  { icon: Plus, label: "Add Unit", variant: "default" as const },
  { icon: AlertTriangle, label: "Add Hazard", variant: "destructive" as const },
  { icon: Camera, label: "Snapshot", variant: "secondary" as const },
  { icon: Users, label: "PAR Check", variant: "default" as const },
  { icon: RotateCcw, label: "Replay", variant: "secondary" as const },
  { icon: Download, label: "Export", variant: "secondary" as const },
]

export function CommandActions() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-card/90 border-t border-border">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-2">Quick Actions</span>
      {actions.map((action) => (
        <Button 
          key={action.label}
          variant={action.variant}
          size="sm"
          className={`h-8 text-xs gap-1.5 ${
            action.variant === "destructive" 
              ? "bg-fire/20 hover:bg-fire/30 text-fire border-fire/30" 
              : ""
          }`}
        >
          <action.icon className="w-3.5 h-3.5" />
          {action.label}
        </Button>
      ))}
    </div>
  )
}
