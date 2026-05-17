"use client"

import { HeaderBar } from "@/components/command/header-bar"
import { RadioPanel } from "@/components/command/radio-panel"
import { TacticalViewport } from "@/components/command/tactical-viewport"
import { IntelligencePanel } from "@/components/command/intelligence-panel"
import { TimelinePanel } from "@/components/command/timeline-panel"
import { CommandActions } from "@/components/command/command-actions"
import { SimulationProvider } from "@/components/command/simulation-context"

export default function FireSceneCommand() {
  return (
    <SimulationProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
        {/* Top Header Bar */}
        <HeaderBar />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Radio Traffic */}
          <RadioPanel />

          {/* Center - Tactical Viewport */}
          <div className="flex-1 flex flex-col">
            <TacticalViewport />
          </div>

          {/* Right Panel - Structure Intelligence */}
          <IntelligencePanel />
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
