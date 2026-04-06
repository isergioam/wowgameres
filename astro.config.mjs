// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://wowgameres.com',
  build: {
    format: 'directory' // Esto genera guias/alquimia/index.html para URLs limpias
  },
  // Si usas GitHub Pages sin dominio personalizado, descomenta la siguiente línea:
  // base: '/wowgameres', 
});
