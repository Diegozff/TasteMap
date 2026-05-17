import { useState, useRef } from 'react'
import CameraUpload from './CameraUpload.jsx'
import LoadingScreen from './LoadingScreen.jsx'
import DishResult from './DishResult.jsx'
import { analyzeDish } from '../services/aiService.js'

const TABS = [
  { id: 'scan', label: 'Escanear', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )},
  { id: 'map', label: 'Mi Mapa', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  )},
  { id: 'profile', label: 'Perfil', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )},
]

function MapPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center gap-6">
      <div className="w-20 h-20 rounded-full bg-saffron/10 flex items-center justify-center text-4xl">🗺</div>
      <div>
        <h2 className="font-serif text-2xl text-ink mb-2">Tu Mapa Gastronómico</h2>
        <p className="text-muted text-sm leading-relaxed">
          Aquí aparecerán todos los platos que hayas escaneado y guardado. Tu historia culinaria en un mapa.
        </p>
      </div>
      <div className="w-full max-w-xs bg-white rounded-2xl border border-ink/5 shadow-sm p-5 text-center animate-shimmer">
        <p className="text-muted text-xs">Escaneá tu primer plato para comenzar el viaje</p>
      </div>
    </div>
  )
}

function ProfilePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center gap-6">
      <div className="w-20 h-20 rounded-full bg-matcha/10 flex items-center justify-center text-4xl">👤</div>
      <div>
        <h2 className="font-serif text-2xl text-ink mb-2">Tu Perfil</h2>
        <p className="text-muted text-sm leading-relaxed">
          Preferencias dietéticas, historial de exploraciones y tus combinaciones favoritas.
        </p>
      </div>
      <div className="w-full max-w-xs flex flex-col gap-3">
        {['Restricciones dietéticas', 'Platos explorados: 0', 'Países visitados: 0'].map((item) => (
          <div key={item} className="bg-white rounded-2xl border border-ink/5 shadow-sm px-5 py-4 flex items-center justify-between">
            <span className="text-ink text-sm font-medium">{item}</span>
            <span className="text-muted">→</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TasteMap() {
  const [activeTab, setActiveTab] = useState('scan')
  const [screen, setScreen] = useState('capture') // capture | loading | result
  const [dietaryProfile, setDietaryProfile] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dishResult, setDishResult] = useState(null)

  async function handleImageSelected(file) {
    const preview = URL.createObjectURL(file)
    setImageFile(file)
    setImagePreview(preview)
    setScreen('loading')

    try {
      const result = await analyzeDish(file, dietaryProfile)
      setDishResult(result)
      setScreen('result')
    } catch {
      setScreen('capture')
    }
  }

  function handleReset() {
    setScreen('capture')
    setDishResult(null)
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
  }

  const showNav = screen !== 'loading'

  return (
    /* Outer wrapper: centers the phone-width container on desktop */
    <div className="min-h-screen bg-gray-100 flex items-start justify-center">
      <div
        className="relative bg-warm flex flex-col min-h-screen overflow-hidden"
        style={{ width: '100%', maxWidth: '430px' }}
      >
        {/* Status bar spacer (simulates native app on mobile) */}
        <div className="h-safe-top" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {screen === 'capture' && activeTab === 'scan' && (
            <CameraUpload
              onImageSelected={handleImageSelected}
              dietaryProfile={dietaryProfile}
              onDietaryChange={setDietaryProfile}
            />
          )}
          {screen === 'capture' && activeTab === 'map' && <MapPlaceholder />}
          {screen === 'capture' && activeTab === 'profile' && <ProfilePlaceholder />}

          {screen === 'loading' && <LoadingScreen imagePreview={imagePreview} />}

          {screen === 'result' && <DishResult dish={dishResult} onReset={handleReset} />}
        </div>

        {/* Bottom navigation */}
        {showNav && (
          <nav className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-ink/5 shadow-lg z-10">
            <div className="flex items-center justify-around px-2 py-3">
              {TABS.map((tab) => {
                const active = activeTab === tab.id && screen === 'capture'
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); if (screen === 'result') handleReset() }}
                    className={`flex flex-col items-center gap-1 px-5 py-1 rounded-xl transition-all duration-200
                      ${active ? 'text-saffron' : 'text-muted hover:text-ink'}`}
                  >
                    {tab.icon(active)}
                    <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-saffron' : 'text-muted'}`}>
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>
            {/* Home indicator line */}
            <div className="flex justify-center pb-2">
              <div className="w-28 h-1 bg-ink/10 rounded-full" />
            </div>
          </nav>
        )}
      </div>
    </div>
  )
}
