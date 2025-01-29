"use client"

import { useState, useCallback, useEffect } from "react"

interface UseVoiceCommandsProps {
  onCommand: (command: string) => void
}

export function useVoiceCommands({ onCommand }: UseVoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false)

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition is not supported in this browser.")
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("")

      if (event.results[0].isFinal) {
        onCommand(transcript.toLowerCase())
      }
    }

    recognition.start()
    setIsListening(true)

    return recognition
  }, [onCommand])

  const stopListening = useCallback(() => {
    setIsListening(false)
  }, [])

  return {
    isListening,
    startListening,
    stopListening,
  }
}

