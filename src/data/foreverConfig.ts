/**
 * Configuración de profesiones para World of Warcraft: Forever.
 * Basado en la guía oficial de lanzamiento:
 * https://www.wowhead.com/forever/es/guide/professions/overview
 *
 * CAJÓN PARA EL FUTURO:
 * Las profesiones que no están disponibles desde el inicio de WoW Forever
 * (Joyería, Inscripción y Arqueología) quedan guardadas aquí con `enabled: false`.
 * Si en una futura fase o parche se añade alguna, basta con cambiar `enabled: true`
 * para activarla automáticamente en la portada, listados, rutas, carrusel y buscador.
 */

export interface ForeverProfessionEntry {
  id: string;
  name: string;
  type: "Producción" | "Recolección" | "Secundaria";
  category: "crafting" | "gathering" | "secondary";
  color: string;
  glow: string;
  enabled: boolean;
  futureNote?: string;
}

export const FOREVER_PROFESSIONS_CONFIG: ForeverProfessionEntry[] = [
  // --- 12 PROFESIONES ACTIVAS DESDE EL LANZAMIENTO ---
  {
    id: "alquimia",
    name: "Alquimia",
    type: "Producción",
    category: "crafting",
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.45)",
    enabled: true,
  },
  {
    id: "herreria",
    name: "Herrería",
    type: "Producción",
    category: "crafting",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.45)",
    enabled: true,
  },
  {
    id: "encantamiento",
    name: "Encantamiento",
    type: "Producción",
    category: "crafting",
    color: "#c084fc",
    glow: "rgba(192, 132, 252, 0.45)",
    enabled: true,
  },
  {
    id: "ingenieria",
    name: "Ingeniería",
    type: "Producción",
    category: "crafting",
    color: "#eab308",
    glow: "rgba(234, 179, 8, 0.45)",
    enabled: true,
  },
  {
    id: "peleteria",
    name: "Peletería",
    type: "Producción",
    category: "crafting",
    color: "#d97706",
    glow: "rgba(217, 119, 6, 0.45)",
    enabled: true,
  },
  {
    id: "sastreria",
    name: "Sastrería",
    type: "Producción",
    category: "crafting",
    color: "#f472b6",
    glow: "rgba(244, 114, 182, 0.45)",
    enabled: true,
  },
  {
    id: "mineria",
    name: "Minería",
    type: "Recolección",
    category: "gathering",
    color: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.45)",
    enabled: true,
  },
  {
    id: "herboristeria",
    name: "Herboristería",
    type: "Recolección",
    category: "gathering",
    color: "#4ade80",
    glow: "rgba(74, 222, 128, 0.45)",
    enabled: true,
  },
  {
    id: "desuello",
    name: "Desuello",
    type: "Recolección",
    category: "gathering",
    color: "#f87171",
    glow: "rgba(248, 113, 113, 0.45)",
    enabled: true,
  },
  {
    id: "cocina",
    name: "Cocina",
    type: "Secundaria",
    category: "secondary",
    color: "#fb923c",
    glow: "rgba(251, 146, 60, 0.45)",
    enabled: true,
  },
  {
    id: "pesca",
    name: "Pesca",
    type: "Secundaria",
    category: "secondary",
    color: "#22d3ee",
    glow: "rgba(34, 211, 238, 0.45)",
    enabled: true,
  },
  {
    id: "primeros-auxilios",
    name: "Primeros Auxilios",
    type: "Secundaria",
    category: "secondary",
    color: "#ec4899",
    glow: "rgba(236, 72, 153, 0.45)",
    enabled: true,
  },

  // --- CAJÓN PARA EL FUTURO (OCULTAS EN EL LANZAMIENTO DE FOREVER) ---
  {
    id: "joyeria",
    name: "Joyería",
    type: "Producción",
    category: "crafting",
    color: "#a855f7",
    glow: "rgba(168, 85, 247, 0.45)",
    enabled: false,
    futureNote: "Guardada para el futuro: no disponible en el lanzamiento inicial de WoW Forever.",
  },
  {
    id: "inscripcion",
    name: "Inscripción",
    type: "Producción",
    category: "crafting",
    color: "#fde047",
    glow: "rgba(253, 224, 71, 0.45)",
    enabled: false,
    futureNote: "Guardada para el futuro: no disponible en el lanzamiento inicial de WoW Forever.",
  },
  {
    id: "arqueologia",
    name: "Arqueología",
    type: "Secundaria",
    category: "secondary",
    color: "#d97706",
    glow: "rgba(217, 119, 6, 0.45)",
    enabled: false,
    futureNote: "Guardada para el futuro: no disponible en el lanzamiento inicial de WoW Forever.",
  },
];

export const ACTIVE_FOREVER_PROFESSION_IDS = new Set(
  FOREVER_PROFESSIONS_CONFIG.filter((p) => p.enabled).map((p) => p.id)
);

export const ARCHIVED_FOREVER_PROFESSION_IDS = new Set(
  FOREVER_PROFESSIONS_CONFIG.filter((p) => !p.enabled).map((p) => p.id)
);

export function isProfessionEnabledInForever(professionId: string): boolean {
  return ACTIVE_FOREVER_PROFESSION_IDS.has(professionId);
}

