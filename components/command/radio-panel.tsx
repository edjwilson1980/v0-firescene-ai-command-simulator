"use client"

import { Radio, Truck, Users, Droplets, AlertTriangle, Shield, Search } from "lucide-react"

interface RadioMessage {
  id: string
  timestamp: string
  unit: string
  message: string
  type: "engine" | "truck" | "ems" | "command" | "hazard" | "search"
}

const radioMessages: RadioMessage[] = [
  { id: "1", timestamp: "14:32", unit: "Command", message: "RIT established, Truck 9 standing by", type: "command" },
  { id: "2", timestamp: "14:28", unit: "Engine 12", message: "Water on the fire, knockdown in progress", type: "engine" },
  { id: "3", timestamp: "14:24", unit: "Truck 5", message: "Primary search all clear, second floor", type: "search" },
  { id: "4", timestamp: "14:20", unit: "Truck 5", message: "Opening roof for ventilation", type: "truck" },
  { id: "5", timestamp: "14:16", unit: "Engine 8", message: "Heavy smoke pushing from second floor windows", type: "hazard" },
  { id: "6", timestamp: "14:12", unit: "Engine 12", message: "Stretching 2½ inch line to Alpha side", type: "engine" },
  { id: "7", timestamp: "14:08", unit: "Battalion 3", message: "Establishing command, Alpha-Delta corner", type: "command" },
  { id: "8", timestamp: "14:04", unit: "Engine 12", message: "On scene, two-story ordinary, smoke showing", type: "engine" },
  { id: "9", timestamp: "14:00", unit: "Dispatch", message: "Structure fire, 1234 S Halsted, multiple calls", type: "command" },
]

const getIcon = (type: RadioMessage["type"]) => {
  switch (type) {
    case "engine": return <Droplets className="w-3.5 h-3.5" />
    case "truck": return <Truck className="w-3.5 h-3.5" />
    case "command": return <Radio className="w-3.5 h-3.5" />
    case "hazard": return <AlertTriangle className="w-3.5 h-3.5" />
    case "search": return <Search className="w-3.5 h-3.5" />
    case "ems": return <Users className="w-3.5 h-3.5" />
    default: return <Radio className="w-3.5 h-3.5" />
  }
}

const getTypeColor = (type: RadioMessage["type"]) => {
  switch (type) {
    case "engine": return "text-water border-water/30 bg-water/10"
    case "truck": return "text-hazard border-hazard/30 bg-hazard/10"
    case "command": return "text-radio border-radio/30 bg-radio/10"
    case "hazard": return "text-fire border-fire/30 bg-fire/10"
    case "search": return "text-safe border-safe/30 bg-safe/10"
    case "ems": return "text-accent border-accent/30 bg-accent/10"
    default: return "text-muted-foreground border-border bg-secondary"
  }
}

export function RadioPanel() {
  return (
    <div className="w-72 flex flex-col tactical-card overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-radio" />
          <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Radio Traffic</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-live animate-pulse" />
          <span className="text-[10px] text-live uppercase font-medium">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {radioMessages.map((msg, index) => (
          <div
            key={msg.id}
            className={`p-2.5 rounded-lg border ${
              index === 0 ? "tactical-glass border-radio/40 glow-radio" : "bg-secondary/50 border-border/50"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${getTypeColor(msg.type)}`}>
                {getIcon(msg.type)}
                <span>{msg.unit}</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">{msg.timestamp}</span>
            </div>
            <p className={`text-xs leading-relaxed ${index === 0 ? "text-foreground" : "text-muted-foreground"}`}>
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Channel: MAIN-TAC 1</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Encrypted
          </span>
        </div>
      </div>
    </div>
  )
}
