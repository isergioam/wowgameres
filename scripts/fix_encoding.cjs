const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../src/content/professions');

const repls = {
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Ã\u0081': 'Á',
    'Ã\u0089': 'É',
    'Ã\u008d': 'Í',
    'Ã\u0093': 'Ó',
    'Ã\u009a': 'Ú',
    'Ã\u0091': 'Ñ',
    'â€“': '–',
    'â€”': '—',
    'Â': '' // Often appears before other characters
};

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.json')) {
        const p = path.join(dir, file);
        let content = fs.readFileSync(p, 'utf8');
        
        // Fix encoding
        Object.keys(repls).forEach(k => {
            content = content.split(k).join(repls[k]);
        });
        
        // Remove BOM if present
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }
        
        fs.writeFileSync(p, content, 'utf8');
        console.log(`Fixed encoding and BOM in ${file}`);
    }
});
