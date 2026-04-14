// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://wowgameres.com',
  build: {
    format: 'directory' // Esto genera guias/alquimia/index.html para URLs limpias
  },
  // Si usas GitHub Pages sin dominio personalizado, descomenta la siguiente línea:
  // base: '/wowgameres', 
  redirects: {
    '/pandaria-joyeria/': '/guias/joyeria/mop',
    '/joyeria-cata.html': '/guias/joyeria/cata',
    '/joyeria-wotlk.html': '/guias/joyeria/wotlk',
    '/joyeria-mop.html': '/guias/joyeria/mop',
    '/legion-ingenieria/': '/guias/ingenieria/legion',
    '/cataclismo-alquimia/': '/guias/alquimia/cata',
    '/draenor-encantamiento/': '/guias/encantamiento/wod',
    '/herreria-bfa.html': '/guias/herreria/bfa',
    '/terrallende-herreria/': '/guias/herreria/tbc',
    '/sastreria-tbc.html': '/guias/sastreria/tbc',
    '/sastreria-cata.html': '/guias/sastreria/cata',
    '/rasganorte-encantamiento/': '/guias/encantamiento/wotlk',
    '/pandaria-sastreria/': '/guias/sastreria/mop',
    '/pandaria-satreria/': '/guias/sastreria/mop',
    '/encantamiento-sl.html': '/guias/encantamiento/sl',
    '/battle-for-azeroth-joyeria/': '/guias/joyeria/bfa',
    '/terrallende-ingenieria/': '/guias/ingenieria/tbc',
    '/cataclismo-joyeria/': '/guias/joyeria/cata',
    '/cataclismo-sastreria/': '/guias/sastreria/cata',
    '/battle-for-azeroth-ingenieria/': '/guias/ingenieria/bfa',
    '/terrallende-peleteria/': '/guias/peleteria/tbc',
    '/pandaria-peleteria/': '/guias/peleteria/mop',
    '/shadowlands-satreria/': '/guias/sastreria/sl',
    '/shadowlands-inscripcion/': '/guias/inscripcion/sl',
    '/inscripcion-sl.html': '/guias/inscripcion/sl',
    '/ingenieria-sl.html': '/guias/ingenieria/sl',
    '/herreria-vanilla.html': '/guias/herreria/vanilla',
    '/cataclismo-inscripcion/': '/guias/inscripcion/cata',
    '/alquimia-midnight.html': '/guias/alquimia/midnight',
    '/alquimia-vanilla.html': '/guias/alquimia/vanilla',
    '/herreria-cata.html': '/guias/herreria/cata',
    '/joyeria-midnight.html': '/guias/joyeria/midnight',
    '/inscripcion-bfa.html': '/guias/inscripcion/bfa',
    '/herreria-legion.html': '/guias/herreria/legion',
    '/inscripcion-mop.html': '/guias/inscripcion/mop',
    '/joyeria-legion.html': '/guias/joyeria/legion',
    '/cataclismo-encantamiento/': '/guias/encantamiento/cata',
    '/pandaria-encantamiento/': '/guias/encantamiento/mop',
    '/vanilla-alquimia/': '/guias/alquimia/vanilla',
    '/peleteria-legion.html': '/guias/peleteria/legion',
    '/encantamiento-tww.html': '/guias/encantamiento/tww',
    '/battle-for-azeroth-encantamiento/': '/guias/encantamiento/bfa',
    '/rasganorte-joyeria/': '/guias/joyeria/wotlk',
    '/terrallende-joyeria/': '/guias/joyeria/tbc',
    '/legion-sastreria/': '/guias/sastreria/legion',
    '/vanilla-satreria/': '/guias/sastreria/vanilla',
    '/terrallende-inscripcion/': '/guias/inscripcion/tbc',
    '/wowgameres-rasganorte-alquimia/': '/guias/alquimia/wotlk',
    '/wowgameres-pandaria-joyeria/': '/guias/joyeria/mop',
    '/wowgameres-rasganorte-sastreria/': '/guias/sastreria/wotlk',

    /* Categorías */
    '/categoria/legion/': '/guias/legion',
    '/categoria/cataclismo/': '/guias/cata',
    '/categoria/battle-for-azeroth/': '/guias/bfa',
    '/categoria/terrallende/': '/guias/tbc',
    '/categoria/draenor/': '/guias/wod',
    '/categoria/vanilla/': '/guias/vanilla',
    '/categoria/pandaria/': '/guias/mop',

    /* Profesiones hacia la última expansión a petición del usuario */
    '/alquimia/': '/guias/alquimia/tww',
    '/peleteria/': '/guias/peleteria/tww',
    '/herreria/': '/guias/herreria/tww',
    '/inscripcion/': '/guias/inscripcion/tww',
    '/joyeria/': '/guias/joyeria/tww'
  },
  integrations: [sitemap()], 
});
