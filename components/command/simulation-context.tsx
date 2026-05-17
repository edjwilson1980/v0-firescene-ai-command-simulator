"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type SectorView = "alpha" | "bravo" | "charlie" | "delta" | "roof" | "overhead" | "interior"
export type MapSource = "tactical" | "satellite" | "google-maps" | "google-earth"
export type TimelineEventId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface TimelineEvent {
  id: TimelineEventId
  time: string
  label: string
  description: string
  fireStatus: "active" | "knocked" | "spreading" | "contained"
  sceneNote: string
}

export const timelineEvents: TimelineEvent[] = [
  { id: 1, time: "00:00", label: "Dispatch", description: "Units dispatched to reported structure fire", fireStatus: "spreading", sceneNote: "Units responding to structure fire" },
  { id: 2, time: "03:42", label: "Arrival", description: "Engine 12 on scene, establishing command", fireStatus: "spreading", sceneNote: "First unit on scene" },
  { id: 3, time: "04:15", label: "Smoke Showing", description: "Heavy smoke from second floor windows", fireStatus: "spreading", sceneNote: "Heavy smoke conditions visible" },
  { id: 4, time: "06:30", label: "Line Stretched", description: "2.5 inch line stretched to Alpha side", fireStatus: "spreading", sceneNote: "Attack line deployed" },
  { id: 5, time: "08:45", label: "Roof Vent", description: "Truck 5 venting roof over fire", fireStatus: "active", sceneNote: "Vertical ventilation in progress" },
  { id: 6, time: "10:30", label: "Fire Located", description: "Fire located in rear bedroom, 2nd floor", fireStatus: "active", sceneNote: "Fire origin identified" },
  { id: 7, time: "12:18", label: "Water On", description: "Water on the fire, beginning knockdown", fireStatus: "contained", sceneNote: "Suppression operations underway" },
  { id: 8, time: "14:24", label: "Primary Clear", description: "Primary search all clear, all floors", fireStatus: "contained", sceneNote: "No victims found" },
]

interface SimulationState {
  selectedSector: SectorView
  setSelectedSector: (sector: SectorView) => void
  mapSource: MapSource
  setMapSource: (source: MapSource) => void
  selectedEventId: TimelineEventId
  setSelectedEventId: (id: TimelineEventId) => void
  currentEvent: TimelineEvent
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
}

const SimulationContext = createContext<SimulationState | null>(null)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [selectedSector, setSelectedSector] = useState<SectorView>("alpha")
  const [mapSource, setMapSource] = useState<MapSource>("tactical")
  const [selectedEventId, setSelectedEventId] = useState<TimelineEventId>(7)
  const [isPlaying, setIsPlaying] = useState(false)

  const currentEvent = timelineEvents.find(e => e.id === selectedEventId) || timelineEvents[0]

  return (
    <SimulationContext.Provider value={{
      selectedSector,
      setSelectedSector,
      mapSource,
      setMapSource,
      selectedEventId,
      setSelectedEventId,
      currentEvent,
      isPlaying,
      setIsPlaying,
    }}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider")
  }
  return context
}
