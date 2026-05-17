const ALERT_STYLES = {
  danger:  { bg: 'bg-chili/10',  border: 'border-chili/30',  text: 'text-chili',  icon: '⚠️' },
  warning: { bg: 'bg-saffron/10', border: 'border-saffron/30', text: 'text-saffron', icon: '⚡' },
  success: { bg: 'bg-matcha/10', border: 'border-matcha/30', text: 'text-matcha',  icon: '✓' },
  info:    { bg: 'bg-ink/5',     border: 'border-ink/10',    text: 'text-muted',   icon: 'ℹ' },
}

function AlertBadge({ alert }) {
  const s = ALERT_STYLES[alert.type] || ALERT_STYLES.info
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl border ${s.bg} ${s.border}`}>
      <span className="text-sm">{s.icon}</span>
      <span className={`text-sm font-medium ${s.text}`}>{alert.message}</span>
    </div>
  )
}

function IngredientTag({ label }) {
  return (
    <span className="px-3 py-1.5 bg-warm border border-muted/15 rounded-full text-xs text-ink font-medium">
      {label}
    </span>
  )
}

export default function DishResult({ dish, onReset }) {
  if (!dish) return null

  return (
    <div className="flex flex-col w-full pb-10 animate-fade-up">

      {/* Hero image */}
      <div className="relative w-full" style={{ height: '340px' }}>
        {dish.imageUrl ? (
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl"
            style={{ background: `linear-gradient(135deg, ${dish.colorAccent}22, ${dish.colorAccent}55)` }}
          >
            🍜
          </div>
        )}
        {/* Cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={onReset}
          className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 active:scale-95 transition-transform"
        >
          ←
        </button>

        {/* Identity overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{dish.flag}</span>
            <span className="text-white/70 text-xs tracking-widest uppercase font-medium">
              {dish.region}
            </span>
          </div>
          <h2 className="font-serif text-3xl text-white leading-tight">{dish.name}</h2>
          <p className="text-white/60 text-xs mt-1 font-light tracking-wide">{dish.era}</p>
        </div>
      </div>

      {/* Content cards */}
      <div className="flex flex-col gap-5 px-5 pt-6">

        {/* Story */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-ink/5">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-saffron mb-3">Historia</p>
          <p className="text-ink text-sm leading-relaxed font-light italic font-serif">
            "{dish.story}"
          </p>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-ink/5">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-4">Composición</p>
          <div className="flex flex-wrap gap-2">
            {dish.ingredients.map((ing) => (
              <IngredientTag key={ing} label={ing} />
            ))}
          </div>
        </div>

        {/* Dietary alerts */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted px-1">Alerta Dietética</p>
          {dish.dietaryAlerts.map((alert, i) => (
            <AlertBadge key={i} alert={alert} />
          ))}
        </div>

        {/* Pairing */}
        <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border border-ink/5 shadow-sm">
          <span className="text-2xl">🍷</span>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider font-medium">Maridaje sugerido</p>
            <p className="text-ink text-sm font-medium mt-0.5">{dish.pairing}</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 pt-2">
          <button className="w-full py-4 rounded-2xl bg-ink text-warm font-semibold text-sm tracking-wide
            flex items-center justify-center gap-2 shadow-lg shadow-ink/20 active:scale-[0.97] transition-transform">
            <span>🗺</span>
            Guardar en mi Mapa Gastronómico
          </button>
          <button className="w-full py-4 rounded-2xl bg-white border border-ink/10 text-ink font-semibold text-sm tracking-wide
            flex items-center justify-center gap-2 shadow-sm active:scale-[0.97] transition-transform">
            <span>↗</span>
            Compartir Tarjeta Histórica
          </button>
        </div>

      </div>
    </div>
  )
}
