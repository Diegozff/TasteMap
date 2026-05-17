import { GoogleGenerativeAI } from '@google/generative-ai'

const LOADING_MESSAGES = [
  'Analizando píxeles y texturas...',
  'Extrayendo herencia cultural y origen...',
  'Verificando ingredientes y alérgenos...',
]

export { LOADING_MESSAGES }

const PROMPT = `Sos un experto gastronómico y antropólogo culinario. Analizá la imagen de este plato y respondé ÚNICAMENTE con un objeto JSON válido (sin markdown, sin bloques de código, solo JSON puro) con esta estructura exacta:

{
  "name": "Nombre del plato en español",
  "region": "Ciudad/Región — País",
  "era": "Período o época de origen (ej: Período Edo, c. 1820)",
  "flag": "Emoji de la bandera del país de origen",
  "story": "Una descripción poética y atrapante de 2-3 oraciones sobre la historia y alma del plato. Debe ser evocadora, cultural y gastronómicamente precisa.",
  "ingredients": ["ingrediente 1", "ingrediente 2", "ingrediente 3"],
  "allergens": ["lista de alérgenos presentes: gluten, lactosa, huevo, mariscos, pescado, soja, frutos secos, cerdo, etc."],
  "dietaryTags": {
    "vegan": false,
    "vegetarian": false,
    "glutenFree": false,
    "dairyFree": false
  },
  "pairing": "Bebida o maridaje sugerido (2 opciones separadas por ·)",
  "colorAccent": "Un color hex que represente visualmente el plato (ej: #C0392B para algo rojo)"
}

Si la imagen NO muestra comida, devolvé: {"error": "No se detectó ningún plato en la imagen."}`

async function fileToGenerativePart(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      resolve({ inlineData: { data: base64, mimeType: file.type } })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function analyzeDish(imageFile, dietaryProfile) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey || apiKey === 'pegá_tu_api_key_aquí') {
    throw new Error('Falta la API Key de Gemini. Agregala en el archivo .env.local')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const imagePart = await fileToGenerativePart(imageFile)
  const result = await model.generateContent([PROMPT, imagePart])
  const text = result.response.text().trim()

  let dish
  try {
    dish = JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      dish = JSON.parse(match[0])
    } else {
      throw new Error('La IA no devolvió un formato válido.')
    }
  }

  if (dish.error) throw new Error(dish.error)

  const alerts = buildDietaryAlerts(dish, dietaryProfile)

  return {
    ...dish,
    id: dish.name.toLowerCase().replace(/\s+/g, '-'),
    dietaryAlerts: alerts,
    imageUrl: URL.createObjectURL(imageFile),
  }
}

function buildDietaryAlerts(dish, profile) {
  const allergens = dish.allergens.map((a) => a.toLowerCase())
  const alerts = []

  if (profile.includes('sin-gluten')) {
    if (allergens.some((a) => a.includes('gluten'))) {
      alerts.push({ type: 'danger', message: '¡Atención! Contiene gluten — no apto para celíacos' })
    } else {
      alerts.push({ type: 'success', message: 'Apto Celíacos — libre de gluten' })
    }
  }

  if (profile.includes('vegano')) {
    if (!dish.dietaryTags?.vegan) {
      alerts.push({ type: 'danger', message: '¡Atención! Contiene ingredientes de origen animal' })
    } else {
      alerts.push({ type: 'success', message: 'Apto Vegano' })
    }
  }

  if (profile.includes('vegetariano') && !dish.dietaryTags?.vegetarian) {
    alerts.push({ type: 'warning', message: 'Contiene carne — no apto para vegetarianos' })
  }

  if (profile.includes('sin-lactosa')) {
    if (allergens.some((a) => a.includes('lactosa') || a.includes('lácteo'))) {
      alerts.push({ type: 'danger', message: '¡Atención! Contiene lácteos' })
    } else if (dish.dietaryTags?.dairyFree) {
      alerts.push({ type: 'success', message: 'Libre de lácteos' })
    }
  }

  if (allergens.some((a) => a.includes('mariscos') || a.includes('pescado'))) {
    alerts.push({ type: 'info', message: 'Contiene mariscos o pescado' })
  }
  if (allergens.some((a) => a.includes('soja'))) {
    alerts.push({ type: 'info', message: 'Contiene soja' })
  }
  if (allergens.some((a) => a.includes('frutos secos') || a.includes('nuez'))) {
    alerts.push({ type: 'info', message: 'Contiene frutos secos' })
  }

  if (alerts.length === 0) {
    alerts.push({ type: 'success', message: 'Sin alertas para tu perfil dietético' })
  }

  return alerts
}
