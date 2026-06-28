"use client"

import { useState } from "react"
import { MapPin, AlertTriangle } from "lucide-react"
import { incidentLocation, type MapSource } from "./simulation-context"

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

/**
 * Renders real Google imagery via the Google Maps Embed API (iframe).
 * Only the non-tactical map sources use this; "tactical" keeps the
 * simulated isometric overlay handled by the parent viewport.
 */
function buildEmbedUrl(source: MapSource): string | null {
  if (!API_KEY) return null

  const { latitude, longitude } = incidentLocation
  const center = `${latitude},${longitude}`

  switch (source) {
    case "satellite":
      return `https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=${center}&zoom=19&maptype=satellite`
    case "google-maps":
      return `https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=${center}&zoom=18&maptype=roadmap`
    case "google-earth":
      // "Street View" source -> Embed API streetview mode
      return `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=${center}&heading=0&pitch=0&fov=90`
    default:
      return null
  }
}

export function GoogleMapsLayer({ source }: { source: MapSource }) {
  const [loaded, setLoaded] = useState(false)
  const url = buildEmbedUrl(source)

  // No API key configured — show a clear, actionable message.
  if (!API_KEY) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-secondary/40 pointer-events-none">
        <div className="max-w-sm rounded-lg border border-hazard/40 bg-card/95 px-4 py-3 text-center shadow-lg">
          <AlertTriangle className="mx-auto mb-2 h-5 w-5 text-hazard" />
          <p className="text-xs font-semibold text-foreground">Google Maps key missing</p>
          <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
            Add{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[9px]">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>{" "}
            to <code className="rounded bg-secondary px-1 py-0.5 text-[9px]">.env.local</code> to load live imagery.
          </p>
        </div>
      </div>
    )
  }

  if (!url) return null

  return (
    <div className="absolute inset-0">
      <iframe
        title={`Google imagery for ${incidentLocation.address}`}
        src={url}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-full w-full border-0"
        onLoad={() => setLoaded(true)}
      />
      {/* Incident address badge */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-md border border-border bg-card/90 px-2 py-1 shadow-lg">
        <MapPin className="h-3 w-3 text-fire" />
        <span className="text-[10px] font-semibold text-foreground">{incidentLocation.address}</span>
      </div>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/60">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Loading imagery…</span>
        </div>
      )}
    </div>
  )
}
