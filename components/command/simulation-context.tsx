"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type SectorView = "alpha" | "bravo" | "charlie" | "delta" | "roof" | "overhead" | "interior"
export type FloorView = "basement" | "floor1" | "floor2" | "floor3" | "attic" | "roof"
export type ViewMode = "sector" | "floor"
export type MapSource = "tactical" | "satellite" | "google-maps" | "google-earth"
export type TimelineEventId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type DisplayMode = "dark" | "light"

// Fixed cross street anchor configuration for 2824 W Marquette Rd, Chicago, IL 60629
// These anchors lock the map orientation to real-world coordinates
export interface CrossStreetAnchor {
  name: string
  direction: "north" | "south" | "east" | "west"
  bearing: number // Degrees from true north (0 = N, 90 = E, 180 = S, 270 = W)
}

export interface IncidentLocation {
  address: string
  city: string
  state: string
  zip: string
  latitude: number
  longitude: number
  // Cross streets define the fixed anchor points for map orientation
  crossStreets: {
    primary: CrossStreetAnchor // The street the address is on (E-W running)
    secondary: CrossStreetAnchor // The nearest cross street (N-S running)
    tertiary?: CrossStreetAnchor // Optional: next cross street for block reference
  }
  // True north bearing offset for this location (Chicago grid is ~1.5° off true north)
  gridBearingOffset: number
}

// Fixed incident location data - cross streets are ANCHOR POINTS that never move
export const incidentLocation: IncidentLocation = {
  address: "2824 W Marquette Rd",
  city: "Chicago",
  state: "IL",
  zip: "60629",
  latitude: 41.7725,
  longitude: -87.6923,
  crossStreets: {
    primary: {
      name: "W Marquette Rd",
      direction: "east", // Street runs east-west, Alpha side faces east
      bearing: 90, // True east
    },
    secondary: {
      name: "S California Ave",
      direction: "north", // Street runs north-south, to the west of address
      bearing: 0, // True north
    },
    tertiary: {
      name: "S Mozart St",
      direction: "north", // Street runs north-south, to the east of address
      bearing: 0, // True north
    },
  },
  // Chicago street grid is approximately 1.5 degrees clockwise from true north
  gridBearingOffset: 1.5,
}

export interface TimelineEvent {
  id: TimelineEventId
  time: string
  label: string
  description: string
  fireStatus: "active" | "knocked" | "spreading" | "contained"
  sceneNote: string
  voiceNote?: string // Base64 encoded audio data
}

export interface VoiceNote {
  timestamp: string
  duration: number // in seconds
  audioData: string // Base64 encoded audio
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

export interface ViewportTransform {
  rotateX: number
  rotateZ: number
  zoom: number
  panX: number
  panY: number
}

const defaultSectorTransforms: Record<SectorView, ViewportTransform> = {
  alpha: { rotateX: 55, rotateZ: -45, zoom: 1, panX: 0, panY: 0 },
  bravo: { rotateX: 55, rotateZ: -135, zoom: 1, panX: 0, panY: 0 },
  charlie: { rotateX: 55, rotateZ: 135, zoom: 1, panX: 0, panY: 0 },
  delta: { rotateX: 55, rotateZ: 45, zoom: 1, panX: 0, panY: 0 },
  roof: { rotateX: 90, rotateZ: -45, zoom: 1.1, panX: 0, panY: 0 },
  overhead: { rotateX: 90, rotateZ: 0, zoom: 1.1, panX: 0, panY: 0 },
  interior: { rotateX: 55, rotateZ: -45, zoom: 1.3, panX: 0, panY: 0 },
}

const defaultFloorTransforms: Record<FloorView, ViewportTransform> = {
  basement: { rotateX: 65, rotateZ: -45, zoom: 0.9, panX: 0, panY: 0 },
  floor1: { rotateX: 65, rotateZ: -45, zoom: 1, panX: 0, panY: 0 },
  floor2: { rotateX: 65, rotateZ: -45, zoom: 1, panX: 0, panY: 0 },
  floor3: { rotateX: 65, rotateZ: -45, zoom: 1, panX: 0, panY: 0 },
  attic: { rotateX: 65, rotateZ: -45, zoom: 0.95, panX: 0, panY: 0 },
  roof: { rotateX: 90, rotateZ: -45, zoom: 1.15, panX: 0, panY: 0 },
}

interface SimulationState {
  selectedSector: SectorView
  setSelectedSector: (sector: SectorView) => void
  selectedFloor: FloorView
  setSelectedFloor: (floor: FloorView) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  mapSource: MapSource
  setMapSource: (source: MapSource) => void
  selectedEventId: TimelineEventId
  setSelectedEventId: (id: TimelineEventId) => void
  currentEvent: TimelineEvent
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  displayMode: DisplayMode
  setDisplayMode: (mode: DisplayMode) => void
  viewportTransform: ViewportTransform
  setViewportTransform: (transform: ViewportTransform) => void
  isFreeRotate: boolean
  setIsFreeRotate: (free: boolean) => void
  resetViewport: () => void
  goToSector: (sector: SectorView) => void
  goToFloor: (floor: FloorView) => void
  voiceNotes: VoiceNote[]
  addVoiceNote: (note: VoiceNote) => void
}

const SimulationContext = createContext<SimulationState | null>(null)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [selectedSector, setSelectedSector] = useState<SectorView>("alpha")
  const [selectedFloor, setSelectedFloor] = useState<FloorView>("floor1")
  const [viewMode, setViewMode] = useState<ViewMode>("sector")
  const [mapSource, setMapSource] = useState<MapSource>("tactical")
  const [selectedEventId, setSelectedEventId] = useState<TimelineEventId>(7)
  const [isPlaying, setIsPlaying] = useState(false)
  const [displayMode, setDisplayMode] = useState<DisplayMode>("dark")
  const [viewportTransform, setViewportTransform] = useState<ViewportTransform>(defaultSectorTransforms.alpha)
  const [isFreeRotate, setIsFreeRotate] = useState(false)
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([])

  const currentEvent = timelineEvents.find(e => e.id === selectedEventId) || timelineEvents[0]

  const resetViewport = () => {
    if (viewMode === "sector") {
      setSelectedSector("alpha")
      setViewportTransform(defaultSectorTransforms.alpha)
    } else {
      setSelectedFloor("floor1")
      setViewportTransform(defaultFloorTransforms.floor1)
    }
    setIsFreeRotate(false)
  }

  const goToSector = (sector: SectorView) => {
    setSelectedSector(sector)
    setViewportTransform(defaultSectorTransforms[sector])
    setIsFreeRotate(false)
  }

  const goToFloor = (floor: FloorView) => {
    setSelectedFloor(floor)
    setViewportTransform(defaultFloorTransforms[floor])
    setIsFreeRotate(false)
  }

  const addVoiceNote = (note: VoiceNote) => {
    setVoiceNotes([...voiceNotes, note])
  }

  return (
    <SimulationContext.Provider value={{
      selectedSector,
      setSelectedSector,
      selectedFloor,
      setSelectedFloor,
      viewMode,
      setViewMode,
      mapSource,
      setMapSource,
      selectedEventId,
      setSelectedEventId,
      currentEvent,
      isPlaying,
      setIsPlaying,
      displayMode,
      setDisplayMode,
      viewportTransform,
      setViewportTransform,
      isFreeRotate,
      setIsFreeRotate,
      resetViewport,
      goToSector,
      goToFloor,
      voiceNotes,
      addVoiceNote,
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
