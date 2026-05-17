import { useEffect, useState } from 'react'
import { LOADING_MESSAGES } from '../services/aiService.js'

export default function LoadingScreen({ imagePreview }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length)
        setVisible(true)
      }, 300)
    }, 1100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-8">

      {/* Image with scan overlay */}
      {imagePreview && (
        <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl shadow-ink/20">
          <img
            src={imagePreview}
            alt="Plato analizando"
            className="w-full object-cover"
            style={{ maxHeight: '300px' }}
          />
          {/* Scan gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink/40" />
          {/* Scan line */}
          <div className="absolute inset-x-0 h-0.5 bg-saffron/80 animate-scan-line shadow-lg shadow-saffron/50" style={{ top: '30%' }} />
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-saffron rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-saffron rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-saffron rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-saffron rounded-br-lg" />
        </div>
      )}

      {/* Spinner + message */}
      <div className="flex flex-col items-center gap-5">
        {/* Minimal spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-muted/20" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-saffron"
            style={{ animation: 'spin 0.9s linear infinite' }}
          />
          <div className="absolute inset-2 rounded-full bg-saffron/10 flex items-center justify-center">
            <span className="text-lg">✦</span>
          </div>
        </div>

        {/* Dynamic message */}
        <p
          className="text-ink font-medium text-base text-center transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {LOADING_MESSAGES[messageIndex]}
        </p>

        {/* Progress dots */}
        <div className="flex gap-2">
          {LOADING_MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === messageIndex ? 'w-6 bg-saffron' : 'w-1.5 bg-muted/30'
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
