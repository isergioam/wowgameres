document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const profession = urlParams.get('p') || 'alquimia';
    const expansion = urlParams.get('e') || 'df';

    if (!profession || !expansion) {
        console.error("Faltan parámetros de profesión o expansión");
        return;
    }

    fetch(`./data/professions/${profession}.json`)
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar la data de la profesión.");
            return response.json();
        })
        .then(data => {
            const expData = data[expansion];
            if (!expData) throw new Error("Expansión no encontrada para esta profesión.");

            renderGuide(expData);
        })
        .catch(err => {
            console.error(err);
            document.getElementById('guide-h1').textContent = "Error al cargar la guía.";
        });
});

function renderGuide(data) {
    // 1. Títulos y Meta
    document.title = `Guía de ${data.professionName} ${data.expansionName} (1-${data.maxLevel}) - WoW | WOWGamerES`;
    document.getElementById('guide-h1').textContent = `Guía de Nivelación de ${data.professionName} – ${data.expansionName} (1-${data.maxLevel})`;
    document.getElementById('meta-description').content = data.description;
    
    const noteEl = document.getElementById('guide-note');
    if (noteEl && data.note) {
        noteEl.innerHTML = data.note;
    }

    // 2. Slider
    const slider = document.getElementById('levelSlider');
    if (slider) {
        slider.max = data.maxLevel;
    }

    // 3. Pasos de nivelación
    const recipesContent = document.getElementById('recipesContent');
    recipesContent.innerHTML = '';
    
    data.steps.forEach(step => {
        const p = document.createElement('p');
        p.className = 'custom-step';
        p.setAttribute('data-min', step.min);
        p.setAttribute('data-max', step.max);
        if (step.mats) {
            p.setAttribute('data-mats', JSON.stringify(step.mats));
        }
        if (step.alt) {
            p.setAttribute('data-alt', 'true');
        }
        p.innerHTML = step.description;
        recipesContent.appendChild(p);
    });

    // Mostrar secciones
    document.getElementById('leveling-controls').style.display = 'block';
    document.getElementById('materiales').style.display = 'block';
    document.getElementById('niveles').style.display = 'block';

    // 4. Reinicializar el Slider que está en script.js
    if (typeof initLevelingSlider === 'function') {
        initLevelingSlider();
    }
}
