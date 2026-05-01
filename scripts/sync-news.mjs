import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuración de la IA
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Limpia un texto para convertirlo en un slug seguro para URLs.
 * Elimina acentos, caracteres especiales y convierte a minúsculas.
 */
function slugify(text) {
  if (text === null || text === undefined) return '';
  const str = typeof text === 'string' ? text : String(text);
  
  return str
    .toLowerCase()
    .normalize('NFD') // Separa los acentos de las letras
    .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
    .replace(/[^\w\s-]/g, '') // Elimina todo lo que no sea letra, número, espacio o guion
    .replace(/\s+/g, '-') // Reemplaza espacios por guiones
    .replace(/--+/g, '-') // Evita guiones dobles
    .trim()
    .split('-')
    .slice(0, 10) // Limitamos a las primeras 10 palabras para URLs más SEO-friendly
    .join('-')
    .replace(/^-+|-+$/g, ''); // Elimina guiones al principio o al final
}

/**
 * Normaliza la categoría de una noticia usando detección de palabras clave.
 * Las categorías de la API de Blizzard son inconsistentes ("WoW", "Puesto comercial WoW", etc.)
 * Esta función las unifica en categorías claras y útiles para los usuarios.
 */
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

  // 3. RETAIL — Expansión retail actual (Midnight + WoW moderno)
  const midnightKeywords = [
    'midnight', 'vacío', "quel'thalas", 'the war within', 'guerra interior',
    'khaz algar', 'alleria', "xal'atath", 'dornogal'
  ];
  if (midnightKeywords.some(kw => titleLower.includes(kw))) return 'Retail';

  // 3. CLASSIC — Versiones clásicas del juego (prioridad en título)
  const classicKeywords = [
    'classic', 'burning crusade', 'terrallende', 'wotlk', 'rasganorte', 'lich king',
    'cataclismo', 'cataclysm', 'pandaria', 'mop', 'draenor', 'wod', 'legión', 'legion',
    'battle for azeroth', 'bfa', 'shadowlands', 'dragonflight',
    'temporada de descubrimiento', 'aniversario', 'anniversary'
  ];
  if (classicKeywords.some(kw => titleLower.includes(kw))) return 'Classic';

  // 4. HOUSING — Adornos y contenido para el hogar (검사 en todo el texto)
  //    Captura Twitch Drops de adornos, noticias de hogares, etc.
  const housingKeywords = [
    'adorno para los hogares', 'adorno para el hogar', 'adornos para el hogar',
    'housing', 'hogar', 'hogares', 'barrio', 'vecindario', 'decoración del hogar',
    'mueble', 'catálogo de adornos', 'parcela'
  ];
  if (housingKeywords.some(kw => fullText.includes(kw))) return 'Housing';

  // 5. PUESTO COMERCIAL — Solo el puesto mensual de Blizzard
  const shopKeywords = [
    'puesto comercial'
  ];
  if (shopKeywords.some(kw => fullText.includes(kw))) return 'Puesto comercial';

  // 6. COMUNIDAD — Eventos, torneos, competiciones
  const communityKeywords = [
    'comunidad', 'community', 'torneo', 'campeonato', 'fanart', 'concurso',
    'podcast', 'entrevista', 'blizzcon', 'arena world championship', 'awc',
    'mythic dungeon international', 'mdi'
  ];
  if (communityKeywords.some(kw => fullText.includes(kw))) return 'Comunidad';

  // Retail en texto general
  if (midnightKeywords.some(kw => fullText.includes(kw))) return 'Retail';
  if (fullText.includes('lunargenta')) return 'Retail';

  // Por defecto: Retail (WoW moderno sin expansión específica)
  return 'Retail';
}

async function generateSummaryTitle(title, description) {
  if (!genAI) return null;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Eres un editor creativo de un portal de World of Warcraft.
    
Basándote en este artículo, escribe un título corto y evocador (máximo 8 palabras) que capture la esencia de la noticia. 
Debe ser dramático, épico o intrigante. No uses comillas. No uses dos puntos. Solo el título.

TÍTULO ORIGINAL: ${title}
DESCRIPCIÓN: ${description.substring(0, 200)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().replace(/^["']|["']$/g, '');
    return text;
  } catch (err) {
    console.error(`Error generando summaryTitle para "${title}":`, err.stack || err.message);
    return null;
  }
}

async function generateSummary(title, content) {
  if (!genAI) {
    return null;
  }

  try {
    console.log(`Generating AI summary for: ${title}...`);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const cleanContent = content.replace(/<[^>]*>?/gm, '').substring(0, 5000);

    const prompt = `Actúa como un redactor experto en World of Warcraft para el sitio web WOWGamerES. 
    Tu tarea es resumir la siguiente noticia oficial de Blizzard de forma atractiva, profesional y única.
    
    TÍTULO: ${title}
    CONTENIDO: ${cleanContent}
    
    Instrucciones:
    1. Escribe 2 párrafos cortos (máximo 120 palabras en total).
    2. Usa un tono cercano para la comunidad pero profesional.
    3. NO empieces con frases como "Esta noticia habla de..." o "Resumen:". Ve directo al grano.
    4. Céntrate en lo más importante para los jugadores (fechas, cambios, recompensas).
    5. Escribe en Español de España.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error(`Error summarizing "${title}":`, err.message);
    return null;
  }
}

async function fetchNews() {
  console.log('Fetching news from Blizzard...');
  // Añadimos un timestamp para evitar cache de red/CDN
  const url = `https://worldofwarcraft.blizzard.com/es-es/news?t=${Date.now()}`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });

  console.log(`Blizzard response status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'No error body');
    console.error('Error response body snippet:', errorText.substring(0, 200));
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const html = await response.text();
  
  // Buscamos el marcador de forma más flexible
  let startMarker = 'model = ';
  let startIndex = html.indexOf(startMarker);
  
  if (startIndex === -1) {
    // Reintento con otra variante común
    startMarker = 'window.model = ';
    startIndex = html.indexOf(startMarker);
  }

  if (startIndex === -1) {
    console.error('HTML Snippet (first 500 chars):', html.substring(0, 500));
    throw new Error('Could not find news model marker (model = or window.model =) in HTML');
  }

  const jsonStart = startIndex + startMarker.length;
  
  // Extraemos el JSON buscando el balance de llaves { }
  // Esto es mucho más robusto que Regex o búsqueda de };
  let jsonText = '';
  let braceCount = 0;
  let started = false;
  let inString = false;
  let escape = false;

  for (let i = jsonStart; i < html.length; i++) {
    const char = html[i];
    jsonText += char;

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{') {
        braceCount++;
        started = true;
      } else if (char === '}') {
        braceCount--;
      }

      if (started && braceCount === 0) {
        break;
      }
    }
  }

  if (!jsonText || braceCount !== 0) {
    throw new Error('Failed to extract balanced JSON from HTML');
  }

  try {
    const model = JSON.parse(jsonText);
    if (!model.blogList || !model.blogList.blogs) {
      console.error('Model keys found:', Object.keys(model));
      if (model.blogList) console.error('blogList keys found:', Object.keys(model.blogList));
      throw new Error('News blogs not found in model structure');
    }
    
    console.log(`Successfully fetched ${model.blogList.blogs.length} blogs from Blizzard.`);
    return model.blogList.blogs;
  } catch (e) {
    console.error('JSON parse failed. Text length:', jsonText.length);
    console.error('JSON Snippet:', jsonText.substring(0, 150), '...');
    throw new Error(`Failed to parse news JSON: ${e.message}`);
  }
}

async function main() {
  console.log(`AI Summary Status: ${genAI ? 'ENABLED' : 'DISABLED (Missing GEMINI_API_KEY)'}`);
  try {
    const rawBlogs = await fetchNews();
    const dataDir = path.resolve('src/content/news');
    const dataPath = path.join(dataDir, 'latest.json');
    
    // Cargar historial existente
    let existingNews = [];
    if (fs.existsSync(dataPath)) {
      try {
        existingNews = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`Cargadas ${existingNews.length} noticias previas.`);
      } catch (e) {
        console.error("Error al leer noticias existentes, se reseteará el archivo.");
      }
    }

    // Re-normalizar categorías y slugs del historial existente también
    existingNews = existingNews.map(item => ({
      ...item,
      category: normalizeCategory(item.category || '', item.title || '', item.description || ''),
      slug: slugify(item.slug || item.title || item.id?.toString() || '')
    }));

    const fetchedNews = [];

    for (const blog of rawBlogs) {
      // Mirar si ya tenemos esta noticia para no pedir resumen a la IA otra vez
      const existing = existingNews.find(n => n.id === blog.id);
      
      let imageUrl = blog.thumb?.url || blog.image?.url || blog.image || '';
      if (imageUrl.startsWith('//')) imageUrl = `https:${imageUrl}`;

      // Extraer categoría raw y normalizarla
      let rawCategory = blog.category || 'WoW';
      if (typeof rawCategory === 'object' && rawCategory !== null) rawCategory = rawCategory.name || 'WoW';
      
      const title = blog.title || '';
      const description = blog.description || blog.subtitle || '';
      const category = normalizeCategory(rawCategory, title, description);

      let bodyContent = blog.content || '';
      bodyContent = bodyContent.replace(/src="\//g, 'src="https://worldofwarcraft.blizzard.com/');

      const newsItem = {
        id: blog.id,
        title,
        slug: slugify(blog.slug || blog.title || (blog.id ? blog.id.toString() : 'news')),
        description,
        content: bodyContent,
        url: blog.url.startsWith('/') ? `https://worldofwarcraft.blizzard.com${blog.url}` : blog.url,
        image: imageUrl,
        date: blog.published || blog.publish_at || blog.created_at || new Date().toISOString(),
        category,
        summary: existing?.summary || null,
        summaryTitle: existing?.summaryTitle || null
      };

      if (!newsItem.summary && genAI) {
        newsItem.summary = await generateSummary(newsItem.title, newsItem.content || newsItem.description);
      }

      if (!newsItem.summaryTitle && genAI) {
        newsItem.summaryTitle = await generateSummaryTitle(newsItem.title, newsItem.description);
        console.log(`  📌 Título generado: "${newsItem.summaryTitle}"`);
      }

      fetchedNews.push(newsItem);
    }

    // Combinar nuevas noticias con el historial
    const allNewsMap = new Map();
    
    // Mantenemos lo que ya teníamos (con categorías normalizadas)
    existingNews.forEach(item => allNewsMap.set(item.id, item));
    
    // Añadimos lo nuevo (sobrescribe si hay actualización de Blizzard)
    fetchedNews.forEach(item => allNewsMap.set(item.id, item));

    const finalNews = Array.from(allNewsMap.values())
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(finalNews, null, 2));

    console.log(`✅ ¡Historial acumulado! Total de noticias en archivo: ${finalNews.length}`);
    console.log(`📂 Categorías usadas: ${[...new Set(finalNews.map(n => n.category))].join(', ')}`);
    if (!genAI) console.log('NOTA: No se generaron nuevos resúmenes (falta GEMINI_API_KEY).');
    
  } catch (err) {
    console.error('Fallo en la sincronización:', err);
    process.exit(1);
  }
}

main();
