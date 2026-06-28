"use client"

import { useState } from "react"
import { HeaderBar } from "@/components/command/header-bar"
import { RadioPanel } from "@/components/command/radio-panel"
import { TacticalViewport } from "@/components/command/tactical-viewport"
import { IntelligencePanel } from "@/components/command/intelligence-panel"
import { TimelinePanel } from "@/components/command/timeline-panel"
import { CommandActions } from "@/components/command/command-actions"
import { SimulationProvider } from "@/components/command/simulation-context"

export default function FireSceneCommand() {
  const [isRadioPanelCollapsed, setIsRadioPanelCollapsed] = useState(false)
  const [isRadioPanelClosed, setIsRadioPanelClosed] = useState(false)
  const [isIntelPanelCollapsed, setIsIntelPanelCollapsed] = useState(false)
  const [isIntelPanelClosed, setIsIntelPanelClosed] = useState(false)

  return (
    <SimulationProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-background relative">
        {/* Top Header Bar */}
        <HeaderBar />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Radio Traffic */}
          <RadioPanel 
            isCollapsed={isRadioPanelCollapsed}
            onToggleCollapse={() => setIsRadioPanelCollapsed(!isRadioPanelCollapsed)}
            isClosed={isRadioPanelClosed}
            onClose={() => setIsRadioPanelClosed(true)}
            onOpen={() => setIsRadioPanelClosed(false)}
          />

          {/* Center - Tactical Viewport */}
          <div className="flex-1 flex flex-col">
            <TacticalViewport />
          </div>

          {/* Right Panel - Structure Intelligence */}
          <IntelligencePanel 
            isCollapsed={isIntelPanelCollapsed}
            onToggleCollapse={() => setIsIntelPanelCollapsed(!isIntelPanelCollapsed)}
            isClosed={isIntelPanelClosed}
            onClose={() => setIsIntelPanelClosed(true)}
            onOpen={() => setIsIntelPanelClosed(false)}
          />
        </div>

        {/* Bottom Area */}
        <div className="flex">
          {/* Timeline - Takes most of the bottom */}
          <div className="flex-1">
            <TimelinePanel />
          </div>
          {/* Command Actions - Right side of bottom */}
          <div className="w-auto">
            <CommandActions />
          </div>
        </div>
      </div>
    </SimulationProvider>
  )
}
