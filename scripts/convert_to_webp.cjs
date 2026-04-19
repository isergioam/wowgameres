const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../src/assets/images');

function getFiles(dir, files_) {
    files_ = files_ || [];
    const files = fs.readdirSync(dir);
    for (const i in files) {
        const name = path.join(dir, files[i]);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')) {
                files_.push(name);
            }
        }
    }
    return files_;
}

const images = getFiles(targetDir);

async function convert() {
    console.log(`Encontradas ${images.length} imágenes para convertir...`);
    for (const image of images) {
        const targetPath = image.replace(/\.(png|jpg|jpeg)$/, '.webp');
        try {
            await sharp(image)
                .webp({ quality: 85 })
                .toFile(targetPath);
            console.log(`✓ Convertida: ${path.basename(image)} -> ${path.basename(targetPath)}`);
            // Borrar el original tras conversión exitosa
            fs.unlinkSync(image); 
        } catch (err) {
            console.error(`✗ Error al convertir ${image}: ${err.message}`);
        }
    }
    console.log('--- Proceso completado ---');
}

convert();
