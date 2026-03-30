/**
 * Script para convertir imágenes PNG a WebP optimizado.
 * 
 * - Convierte todas las imágenes PNG de la carpeta images/ a WebP
 * - Las redimensiona manteniendo proporciones (max 400px de ancho para iconos, 600px para logos)
 * - Calidad 80 para balance óptimo entre tamaño y calidad visual
 * - Los PNG originales se mantienen en images/original/ como backup
 * - Actualiza todas las referencias en HTML y CSS de .png a .webp
 * 
 * REQUISITOS: npm install sharp
 * USO: node scripts/convert-to-webp.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images');
const BACKUP_DIR = path.join(IMAGES_DIR, 'original');

// Configuración por tipo de imagen
const CONFIG = {
  logos: {
    // Logos: un poco más grandes para mantener calidad
    maxWidth: 600,
    quality: 85,
    patterns: ['WOWGamerES_Logo', 'WOWGamerES_2026']
  },
  icons: {
    // Iconos de profesiones: se muestran a 150-200px 
    maxWidth: 400,
    quality: 80,
    patterns: ['_wow']
  }
};

async function convertImages() {
  // Crear directorio de backup
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('📁 Creado directorio de backup: images/original/');
  }

  // Obtener todos los PNG (excluir subdirectorios)
  const pngFiles = fs.readdirSync(IMAGES_DIR).filter(f => 
    f.endsWith('.png') && fs.statSync(path.join(IMAGES_DIR, f)).isFile()
  );

  console.log(`\n🔍 Encontradas ${pngFiles.length} imágenes PNG para convertir:\n`);

  let totalOriginal = 0;
  let totalWebp = 0;

  for (const file of pngFiles) {
    const inputPath = path.join(IMAGES_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    const outputFile = file.replace('.png', '.webp');
    const outputPath = path.join(IMAGES_DIR, outputFile);

    // Determinar configuración
    let maxWidth = 400;
    let quality = 80;

    if (CONFIG.logos.patterns.some(p => file.includes(p))) {
      maxWidth = CONFIG.logos.maxWidth;
      quality = CONFIG.logos.quality;
    } else if (CONFIG.icons.patterns.some(p => file.includes(p))) {
      maxWidth = CONFIG.icons.maxWidth;
      quality = CONFIG.icons.quality;
    }

    try {
      const originalSize = fs.statSync(inputPath).size;
      totalOriginal += originalSize;

      // Obtener metadatos de la imagen original
      const metadata = await sharp(inputPath).metadata();

      // Backup del original
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(inputPath, backupPath);
      }

      // Convertir a WebP con resize
      const resizeWidth = metadata.width > maxWidth ? maxWidth : undefined;

      await sharp(inputPath)
        .resize(resizeWidth, null, { 
          withoutEnlargement: true,
          fit: 'inside' 
        })
        .webp({ quality })
        .toFile(outputPath);

      const webpSize = fs.statSync(outputPath).size;
      totalWebp += webpSize;

      const reduction = ((1 - webpSize / originalSize) * 100).toFixed(1);
      const originalMB = (originalSize / (1024 * 1024)).toFixed(2);
      const webpKB = (webpSize / 1024).toFixed(1);

      console.log(`  ✅ ${file}`);
      console.log(`     ${originalMB} MB → ${webpKB} KB (−${reduction}%)`);
      console.log(`     Dimensiones: ${metadata.width}×${metadata.height} → max ${maxWidth}px ancho`);
    } catch (err) {
      console.error(`  ❌ Error con ${file}: ${err.message}`);
    }
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`📊 RESUMEN DE CONVERSIÓN`);
  console.log(`${'═'.repeat(50)}`);
  console.log(`  Total original: ${(totalOriginal / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`  Total WebP:     ${(totalWebp / 1024).toFixed(1)} KB`);
  console.log(`  Reducción:      ${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%`);
  console.log(`  Backups en:     images/original/\n`);

  // Fase 2: Actualizar referencias en HTML y CSS
  console.log(`🔄 Actualizando referencias .png → .webp en HTML y CSS...\n`);
  await updateReferences();
}

async function updateReferences() {
  // Mapeo de archivos PNG a WebP (solo los que se convirtieron)
  const webpFiles = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.webp'));
  const pngToWebp = {};
  webpFiles.forEach(f => {
    pngToWebp[f.replace('.webp', '.png')] = f;
  });

  // Actualizar archivos HTML
  const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  let htmlUpdated = 0;

  htmlFiles.forEach(file => {
    const filePath = path.join(ROOT, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const [png, webp] of Object.entries(pngToWebp)) {
      if (content.includes(png)) {
        content = content.split(png).join(webp);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ ${file}`);
      htmlUpdated++;
    }
  });

  // Actualizar archivos CSS
  const cssDir = path.join(ROOT, 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    cssFiles.forEach(file => {
      const filePath = path.join(cssDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      for (const [png, webp] of Object.entries(pngToWebp)) {
        if (content.includes(png)) {
          content = content.split(png).join(webp);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ css/${file}`);
      }
    });
  }

  // Actualizar script.js (las rutas de logos)
  const jsDir = path.join(ROOT, 'js');
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
    jsFiles.forEach(file => {
      const filePath = path.join(jsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      for (const [png, webp] of Object.entries(pngToWebp)) {
        if (content.includes(png)) {
          content = content.split(png).join(webp);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ js/${file}`);
      }
    });
  }

  console.log(`\n  ${htmlUpdated} archivos HTML actualizados.`);
  console.log(`\n🎉 ¡Conversión completada! Las imágenes originales están en images/original/`);
}

convertImages().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
