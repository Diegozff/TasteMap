const DISH_DATABASE = [
  {
    id: 'tonkotsu-ramen',
    name: 'Tonkotsu Ramen',
    region: 'Fukuoka, Kyushu — Japón',
    era: 'Era Shōwa, c. 1941',
    flag: '🇯🇵',
    story:
      'Nacido en los puestos callejeros de Fukuoka durante la posguerra, el Tonkotsu es la alquimia de un caldo de huesos de cerdo cocido 18 horas hasta volverse opaco como la leche. Cada cuenco es un mantra: el vapor que sube es incienso, los fideos son el tiempo mismo enroscado.',
    ingredients: ['Hueso de cerdo', 'Fideos ramen', 'Chashu', 'Nori', 'Huevo nitamago', 'Cebolla verde', 'Maíz', 'Jengibre', 'Ajo negro'],
    allergens: ['gluten', 'soja', 'huevo', 'cerdo'],
    dietaryTags: { vegan: false, vegetarian: false, glutenFree: false, dairyFree: true },
    colorAccent: '#C0392B',
    pairing: 'Asahi Super Dry · Sake Junmai',
  },
  {
    id: 'asado-argentino',
    name: 'Asado Criollo',
    region: 'Pampa Húmeda — Argentina',
    era: 'Tradición gaucha, s. XVII',
    flag: '🇦🇷',
    story:
      'El asado no es una técnica: es una liturgia. Los gauchos de la Pampa descubrieron que la leña de quebracho y el fuego lento convierten la carne en poesía. Reunirse alrededor del fuego es el idioma más antiguo de los argentinos — una conversación de horas que nunca se apresura.',
    ingredients: ['Vacío', 'Costillar', 'Chorizo criollo', 'Morcilla', 'Chimichurri', 'Sal parrillera', 'Limón'],
    allergens: ['ninguno destacado'],
    dietaryTags: { vegan: false, vegetarian: false, glutenFree: true, dairyFree: true },
    colorAccent: '#E8871A',
    pairing: 'Malbec Luján de Cuyo · Fernet con Coca',
  },
  {
    id: 'omakase-sushi',
    name: 'Omakase Nigiri',
    region: 'Kioto — Japón',
    era: 'Período Edo, c. 1820',
    flag: '🇯🇵',
    story:
      'Omakase significa "me pongo en tus manos". El itamae elige por vos: cada pieza de nigiri es una conversación entre el pescado del día, el arroz sazonado con vinagre rojo y el momento exacto en que el frío del pescado toca el calor del arroz. Comer omakase es un acto de fe.',
    ingredients: ['Maguro', 'Hamachi', 'Uni', 'Ikura', 'Arroz shari', 'Wasabi fresco', 'Alga nori', 'Vinagre rojo', 'Salsa de soja'],
    allergens: ['mariscos', 'pescado', 'soja', 'gluten'],
    dietaryTags: { vegan: false, vegetarian: false, glutenFree: false, dairyFree: true },
    colorAccent: '#4A7C59',
    pairing: 'Sake Daiginjo · Té verde Gyokuro',
  },
]

const LOADING_MESSAGES = [
  'Analizando píxeles y texturas...',
  'Extrayendo herencia cultural y origen...',
  'Verificando ingredientes y alérgenos...',
]

export { LOADING_MESSAGES }

export async function analyzeDish(imageFile, dietaryProfile) {
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const randomDish = DISH_DATABASE[Math.floor(Math.random() * DISH_DATABASE.length)]

  const alerts = buildDietaryAlerts(randomDish, dietaryProfile)

  return {
    ...randomDish,
    dietaryAlerts: alerts,
    imageUrl: imageFile ? URL.createObjectURL(imageFile) : null,
  }
}

function buildDietaryAlerts(dish, profile) {
  const alerts = []

  if (profile.includes('sin-gluten') && dish.allergens.includes('gluten')) {
    alerts.push({ type: 'danger', message: '¡Atención! Contiene gluten — no apto para celíacos' })
  }
  if (profile.includes('sin-gluten') && !dish.allergens.includes('gluten')) {
    alerts.push({ type: 'success', message: 'Apto Celíacos — libre de gluten' })
  }
  if (profile.includes('vegano') && !dish.dietaryTags.vegan) {
    alerts.push({ type: 'danger', message: '¡Atención! Contiene ingredientes de origen animal' })
  }
  if (profile.includes('vegano') && dish.dietaryTags.vegan) {
    alerts.push({ type: 'success', message: 'Apto Vegano' })
  }
  if (profile.includes('vegetariano') && !dish.dietaryTags.vegetarian) {
    alerts.push({ type: 'warning', message: 'Contiene carne — no apto para vegetarianos' })
  }
  if (dish.allergens.includes('mariscos')) {
    alerts.push({ type: 'info', message: 'Contiene mariscos y pescado' })
  }
  if (dish.allergens.includes('soja')) {
    alerts.push({ type: 'info', message: 'Contiene soja' })
  }

  if (alerts.length === 0) {
    alerts.push({ type: 'success', message: 'Sin alertas para tu perfil dietético' })
  }

  return alerts
}
