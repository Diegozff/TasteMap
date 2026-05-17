import { useRef, useState } from 'react'

const DIETARY_OPTIONS = [
  { id: 'sin-gluten', label: 'Sin Gluten', icon: '🌾' },
  { id: 'vegano', label: 'Vegano', icon: '🌿' },
  { id: 'vegetariano', label: 'Vegetariano', icon: '🥗' },
  { id: 'sin-lactosa', label: 'Sin Lactosa', icon: '🥛' },
]

export default function CameraUpload({ onImageSelected, dietaryProfile, onDietaryChange }) {
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  function toggleDietary(id) {
    if (dietaryProfile.includes(id)) {
      onDietaryChange(dietaryProfile.filter((d) => d !== id))
    } else {
      onDietaryChange([...dietaryProfile, id])
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full px-6 pb-10">

      {/* Hero header */}
      <div className="text-center pt-12 pb-2">
        <p className="text-xs font-medium tracking-[0.25em] uppercase text-saffron mb-3">
          Gastro Intelligence
        </p>
        <h1 className="font-serif text-4xl text-ink leading-tight mb-3">
          El Alma<br />
          <em>de tu Plato</em>
        </h1>
        <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
          Fotografía cualquier plato y descubrí su historia, origen y composición en segundos.
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={`relative w-full rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragging
            ? 'border-saffron bg-saffron/5 scale-[1.02]'
            : 'border-muted/30 bg-white hover:border-saffron/50 hover:bg-saffron/3'
          }`}
        style={{ minHeight: '220px' }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center h-full py-12 gap-4">
          <div
            className="w-20 h-20 rounded-full bg-saffron/10 flex items-center justify-center animate-pulse-ring"
            style={{ animationPlayState: isDragging ? 'running' : 'paused' }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E8871A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-ink font-medium text-sm">Arrastrá tu foto aquí</p>
            <p className="text-muted text-xs mt-1">o tocá para seleccionar</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Camera button — primary CTA */}
      <button
        onClick={() => cameraInputRef.current?.click()}
        className="w-full py-5 rounded-2xl bg-ink text-warm font-semibold text-base tracking-wide
          flex items-center justify-center gap-3 shadow-lg shadow-ink/20
          active:scale-[0.97] transition-transform duration-150"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        Escanear Plato
      </button>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {/* Dietary preferences */}
      <div className="w-full">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-3">
          Mi Perfil Dietético
        </p>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((opt) => {
            const active = dietaryProfile.includes(opt.id)
            return (
              <button
                key={opt.id}
                onClick={() => toggleDietary(opt.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                  ${active
                    ? 'bg-saffron border-saffron text-white shadow-sm shadow-saffron/30'
                    : 'bg-white border-muted/20 text-ink hover:border-saffron/40'
                  }`}
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Ambient decoration */}
      <div className="w-full flex items-center gap-4 opacity-30">
        <div className="flex-1 h-px bg-ink" />
        <span className="text-xs font-serif italic text-ink">Desde el fuego a tu pantalla</span>
        <div className="flex-1 h-px bg-ink" />
      </div>

    </div>
  )
}
