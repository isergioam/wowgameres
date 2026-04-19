import fs from 'fs';
import path from 'path';

function normalizeCategory(rawCategory, title = '', description = '') {
  const titleLower = title.toLowerCase();
  const fullText = `${rawCategory} ${title} ${description}`.toLowerCase();

  // 1. NOVEDADES — Parches, notas de actualización y correcciones en vivo
  const novedadesKeywords = [
    'notas de la actualización', 'notas de actualización', 'update notes', 'patch notes',
    'correcciones en vivo', 'hotfixes', 'correcciones del', 'notas del parche'
  ];
  if (novedadesKeywords.some(kw => titleLower.includes(kw))) return 'Novedades';

  // 2. QUÉ HACER — Resúmenes semanales
  const queHacerKeywords = [
    'esta semana en wow', 'esta semana en world of warcraft',
    'notas de la semana', 'qué hacer esta semana'
  ];
  if (queHacerKeywords.some(kw => titleLower.includes(kw))) return 'Qué hacer';

  // 3. RETAIL — Midnight + WoW moderno
  const midnightKeywords = [
    'midnight', 'vacío', "quel'thalas", 'the war within', 'guerra interior',
    'khaz algar', 'alleria', "xal'atath", 'dornogal'
  ];
  if (midnightKeywords.some(kw => titleLower.includes(kw))) return 'Retail';

  // 4. CLASSIC — Versiones clásicas del juego
  const classicKeywords = [
    'classic', 'burning crusade', 'terrallende', 'wotlk', 'rasganorte', 'lich king',
    'cataclismo', 'cataclysm', 'pandaria', 'mop', 'draenor', 'wod', 'legión', 'legion',
    'battle for azeroth', 'bfa', 'shadowlands', 'dragonflight',
    'temporada de descubrimiento', 'aniversario', 'anniversary'
  ];
  if (classicKeywords.some(kw => titleLower.includes(kw))) return 'Classic';

  // 5. HOUSING — Adornos y contenido para el hogar
  const housingKeywords = [
    'adorno para los hogares', 'adorno para el hogar', 'adornos para el hogar',
    'housing', 'hogar', 'hogares', 'barrio', 'vecindario', 'decoración del hogar',
    'mueble', 'catálogo de adornos', 'parcela'
  ];
  if (housingKeywords.some(kw => fullText.includes(kw))) return 'Housing';

  // 6. PUESTO COMERCIAL — Solo el puesto mensual
  if (fullText.includes('puesto comercial')) return 'Puesto comercial';

  // 7. COMUNIDAD — Eventos, torneos, competiciones
  const communityKeywords = [
    'comunidad', 'community', 'torneo', 'campeonato', 'fanart', 'concurso',
    'podcast', 'entrevista', 'blizzcon', 'arena world championship', 'awc',
    'mythic dungeon international', 'mdi'
  ];
  if (communityKeywords.some(kw => fullText.includes(kw))) return 'Comunidad';

  // Retail en texto general (Midnight sin mención en título)
  if (midnightKeywords.some(kw => fullText.includes(kw))) return 'Retail';
  if (fullText.includes('lunargenta')) return 'Retail';

  // Por defecto: Retail
  return 'Retail';
}

const dataPath = path.resolve('src/content/news/latest.json');
const news = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const stats = {};
const updated = news.map(item => {
  const oldCat = item.category;
  const newCat = normalizeCategory(oldCat, item.title, item.description);
  stats[newCat] = (stats[newCat] || 0) + 1;
  if (oldCat !== newCat) {
    console.log(`  [${oldCat}] → [${newCat}]: "${item.title.substring(0, 60)}"`);
  }
  return { ...item, category: newCat };
});

fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2));

console.log('\n✅ Categorías normalizadas en latest.json');
console.log('📊 Distribución final:');
Object.entries(stats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`   ${cat}: ${count} noticias`);
});
