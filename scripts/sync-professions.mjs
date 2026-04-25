import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const PROFESSIONS_MAP = {
  mineria: "https://www.wow-professions.com/guides/wow-mining-leveling-guide",
  herboristeria: "https://www.wow-professions.com/guides/wow-herbalism-leveling-guide",
  desuello: "https://www.wow-professions.com/guides/wow-skinning-leveling-guide",
  alquimia: "https://www.wow-professions.com/guides/wow-alchemy-leveling-guide",
  herreria: "https://www.wow-professions.com/guides/wow-blacksmithing-leveling-guide",
  ingenieria: "https://www.wow-professions.com/guides/wow-engineering-leveling-guide",
  joyeria: "https://www.wow-professions.com/guides/wow-jewelcrafting-leveling-guide",
  inscripcion: "https://www.wow-professions.com/guides/wow-inscription-leveling-guide",
  peleteria: "https://www.wow-professions.com/guides/wow-leatherworking-leveling-guide",
  sastreria: "https://www.wow-professions.com/guides/wow-tailoring-leveling-guide",
  encantamiento: "https://www.wow-professions.com/guides/wow-enchanting-leveling-guide",
  cocina: "https://www.wow-professions.com/guides/wow-cooking-leveling-guide",
  pesca: "https://www.wow-professions.com/guides/wow-fishing-leveling-guide",
  arqueologia: "https://www.wow-professions.com/guides/wow-archaeology-leveling-guide"
};

async function fetchGuideHTML(url) {
  console.log(`Fetching guide from: ${url}...`);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.text();
}

async function extractGuideData(html, professionId, expansionId) {
  if (!genAI) throw new Error("GEMINI_API_KEY not found.");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  // Limpiamos un poco el HTML para no exceder tokens innecesariamente
  const cleanHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                        .substring(0, 30000); 

  const prompt = `Eres un experto en World of Warcraft encargado de extraer datos estructurados de guías de nivelación de profesiones.
  
  TU TAREA:
  Analiza el HTML proporcionado de una guía de ${professionId} para la expansión ${expansionId}.
  Extrae los pasos de nivelación y genera un objeto JSON que siga EXACTAMENTE esta estructura:

  {
    "expansionName": "Nombre de la expansión en español (ej: Midnight, The War Within)",
    "professionName": "Nombre de la profesión en español",
    "maxLevel": número (nivel máximo de la guía, ej: 100),
    "description": "Una breve descripción de la guía en español",
    "steps": [
      {
        "min": número (nivel de inicio),
        "max": número (nivel de fin),
        "mats": { "Nombre Material": "Cantidad o 'Aprox'" },
        "description": "HTML amigable con etiquetas <strong> y <br> explicando qué hacer. NO incluyas el título del nivel aquí, usa el formato: <div class='step-title'>Profesión X - Y: Título</div> Resto de la explicación."
      }
    ]
  }

  REGLAS CRÍTICAS:
  1. El resultado debe ser ÚNICAMENTE el objeto JSON, sin bloques de código markdown ni texto adicional.
  2. Traduce los nombres de materiales y descripciones al ESPAÑOL DE ESPAÑA.
  3. Asegúrate de que los niveles min/max sean coherentes.
  4. Si no hay materiales específicos (como en recolección), deja "mats" como {}.
  5. Usa <div class="step-title">...</div> para el encabezado de cada paso dentro de la descripción.

  HTML A ANALIZAR:
  ${cleanHtml}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text().trim();
  
  // Limpiar posibles bloques de código markdown
  text = text.replace(/^```json/, '').replace(/```$/, '').trim();
  
  return JSON.parse(text);
}

async function main() {
  const [,, targetProfId, targetExpansionId = 'midnight'] = process.argv;

  if (targetProfId && !PROFESSIONS_MAP[targetProfId]) {
    console.error(`Error: Profesión "${targetProfId}" no encontrada en el mapa.`);
    process.exit(1);
  }

  const professionsToSync = targetProfId ? [targetProfId] : Object.keys(PROFESSIONS_MAP);

  for (const profId of professionsToSync) {
    try {
      console.log(`\n--- Sincronizando ${profId} (${targetExpansionId}) ---`);
      const url = PROFESSIONS_MAP[profId];
      const html = await fetchGuideHTML(url);
      const newData = await extractGuideData(html, profId, targetExpansionId);
      
      const filePath = path.resolve(`src/content/professions/${profId}.json`);
      
      let existingContent = {};
      if (fs.existsSync(filePath)) {
        existingContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }

      // Actualizamos o añadimos la expansión
      existingContent[targetExpansionId] = newData;

      fs.writeFileSync(filePath, JSON.stringify(existingContent, null, 2));
      console.log(`✅ Guía de ${profId} actualizada correctamente en ${filePath}`);

    } catch (err) {
      console.error(`❌ Error sincronizando ${profId}:`, err.message);
    }
  }
}

main();
