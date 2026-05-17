"use client"

import { useState, useRef } from "react"
import { Mic, Square, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSimulation } from "./simulation-context"
import { cn } from "@/lib/utils"

interface VoiceNoteRecorderProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceNoteRecorder({ isOpen, onClose }: VoiceNoteRecorderProps) {
  const { displayMode, addVoiceNote } = useSimulation()
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const getDisplayModeStyles = () => {
    switch (displayMode) {
      case "light":
        return {
          containerBg: "bg-white/95 border-slate-300",
          textColor: "text-slate-900",
          mutedText: "text-slate-500",
          buttonHover: "hover:bg-slate-100",
          recordingBg: "bg-red-100 border-red-300",
          recordingText: "text-red-600",
        }
      default:
        return {
          containerBg: "bg-card/90 border-border",
          textColor: "text-foreground",
          mutedText: "text-muted-foreground",
          buttonHover: "hover:bg-secondary",
          recordingBg: "bg-fire/20 border-fire/40",
          recordingText: "text-fire",
        }
    }
  }

  const styles = getDisplayModeStyles()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setRecordedAudio(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const handleSaveVoiceNote = async () => {
    if (recordedAudio) {
      const reader = new FileReader()
      reader.onload = () => {
        const audioData = reader.result as string
        const timestamp = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })

        addVoiceNote({
          timestamp,
          duration,
          audioData,
        })

        resetRecorder()
        onClose()
      }
      reader.readAsDataURL(recordedAudio)
    }
  }

  const resetRecorder = () => {
    setRecordedAudio(null)
    setDuration(0)
    chunksRef.current = []
  }

  const handleCancel = () => {
    if (isRecording) {
      stopRecording()
    }
    resetRecorder()
    onClose()
  }

  if (!isOpen) return null

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={cn("rounded-lg border p-6 max-w-md w-full", styles.containerBg)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn("text-sm font-semibold uppercase tracking-wide", styles.textColor)}>
            Voice Note Recorder
          </h3>
          <button
            onClick={handleCancel}
            className={cn("p-1 rounded hover:bg-secondary transition-colors", styles.buttonHover)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Recording Display */}
          <div
            className={cn(
              "rounded-lg border p-6 text-center transition-all",
              isRecording && styles.recordingBg,
              !isRecording && recordedAudio && "bg-secondary/50 border-border",
              !isRecording && !recordedAudio && "bg-secondary/30 border-border"
            )}
          >
            {!recordedAudio ? (
              <>
                <div className={cn("text-2xl font-mono font-bold mb-3", isRecording && styles.recordingText)}>
                  {formatDuration(duration)}
                </div>
                <p className={cn("text-xs", styles.mutedText)}>
                  {isRecording ? "Recording in progress..." : "Ready to record"}
                </p>
              </>
            ) : (
              <>
                <div className={cn("text-sm font-mono font-bold mb-2", styles.textColor)}>
                  Duration: {formatDuration(duration)}
                </div>
                <p className={cn("text-xs", styles.mutedText)}>
                  Recording saved (not yet added to timeline)
                </p>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!recordedAudio ? (
              <>
                <Button
                  variant={isRecording ? "secondary" : "default"}
                  size="sm"
                  className={cn(
                    "flex-1",
                    isRecording && "bg-fire text-white hover:bg-fire/90"
                  )}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-1" />
                      Record
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={resetRecorder}
                >
                  Re-record
                </Button>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className={cn("flex-1", !recordedAudio && "opacity-50 cursor-not-allowed")}
              onClick={handleSaveVoiceNote}
              disabled={!recordedAudio}
            >
              <Check className="w-4 h-4 mr-1" />
              Save to Timeline
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
