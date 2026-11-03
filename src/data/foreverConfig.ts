/**
 * Configuración de profesiones y Sistema de Campamentos para World of Warcraft: Forever.
 * Basado en las guías oficiales de Wowhead:
 * - https://www.wowhead.com/forever/es/guide/professions/overview
 * - https://www.wowhead.com/forever/es/guide/camping-overview-unlock-rewards
 *
 * CAJÓN PARA EL FUTURO:
 * Las profesiones que no están disponibles desde el inicio de WoW Forever
 * (Joyería, Inscripción y Arqueología) quedan guardadas aquí con `enabled: false`.
 * Si en una futura fase o parche se añade alguna, basta con cambiar `enabled: true`
 * para activarla automáticamente en la portada, listados, rutas, carrusel y buscador.
 */

export interface CampingTierInfo {
  tier: number;
  skillReq: number;
  itemName: string;
  effect: string;
}

export interface ForeverProfessionEntry {
  id: string;
  name: string;
  type: "Producción" | "Recolección" | "Secundaria";
  category: "crafting" | "gathering" | "secondary";
  color: string;
  glow: string;
  enabled: boolean;
  campBuffShort?: string;
  campBuff?: string;
  campSummary?: string;
  campTiers?: CampingTierInfo[];
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
    campBuffShort: "🔥 +Regen. Maná",
    campBuff: "Regeneración de maná",
    campSummary: "Pozo de maná, Fermentador de reactivos y Laboratorio de alquimia portátil.",
    campTiers: [
      {
        tier: 1,
        skillReq: 20,
        itemName: "Pozo de maná",
        effect: "Otorga regeneración de maná a todos los jugadores que descansen junto a la hoguera.",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Fermentador",
        effect: "Permite elaborar reactivos especiales en el campamento + regeneración de maná.",
      },
      {
        tier: 3,
        skillReq: 300,
        itemName: "Laboratorio de alquimia",
        effect: "Habilita las recetas que requieren un Laboratorio de alquimia en mundo abierto + regeneración de maná.",
      },
    ],
  },
  {
    id: "herreria",
    name: "Herrería",
    type: "Producción",
    category: "crafting",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.45)",
    enabled: true,
    campBuffShort: "🔥 +Fuerza",
    campBuff: "Fuerza aumentada",
    campSummary: "Rueda de afilar (+Fuerza), Yunque portátil y Forja de maestro en el campamento.",
    campTiers: [
      {
        tier: 1,
        skillReq: 20,
        itemName: "Rueda de afilar",
        effect: "Aumenta la Fuerza de los jugadores que descansen junto al campamento.",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Yunque",
        effect: "Despliega un Yunque portátil utilizable por el grupo + beneficio de Fuerza.",
      },
      {
        tier: 3,
        skillReq: 300,
        itemName: "Forja de maestro",
        effect: "Habilita fundición y recetas que requieren una Forja en cualquier lugar + beneficio de Fuerza.",
      },
    ],
  },
  {
    id: "encantamiento",
    name: "Encantamiento",
    type: "Producción",
    category: "crafting",
    color: "#c084fc",
    glow: "rgba(192, 132, 252, 0.45)",
    enabled: true,
    campBuffShort: "🔥 +Armadura y Resist.",
    campBuff: "Armadura, Estadísticas y Resistencias",
    campSummary: "Triple bufo defensivo, desencantamiento mejorado y Forja Arcana portátil.",
    campTiers: [
      {
        tier: 1,
        skillReq: 20,
        itemName: "Laúd encantado",
        effect: "Aumenta la Armadura, todas las Estadísticas y las Resistencias al descansar.",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Recuperador Arcano",
        effect: "Mejora la eficiencia al desencantar objetos en el campamento + triple beneficio.",
      },
      {
        tier: 3,
        skillReq: 300,
        itemName: "Forja Arcana",
        effect: "Permite elaborar recetas que requieren una Forja Arcana + triple beneficio.",
      },
    ],
  },
  {
    id: "ingenieria",
    name: "Ingeniería",
    type: "Producción",
    category: "crafting",
    color: "#eab308",
    glow: "rgba(234, 179, 8, 0.45)",
    enabled: true,
    campBuffShort: "🔥 Reparar y Vendedor",
    campBuff: "Vendedor de componentes y Reparación",
    campSummary: "Robots de venta de componentes, reparación de armadura y banco de trabajo.",
    campTiers: [
      {
        tier: 1,
        skillReq: 20,
        itemName: "Robot de componentes",
        effect: "Despliega un vendedor mecánico para comprar componentes y reactivos en el mundo.",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Robot de reparaciones",
        effect: "Permite a todo el grupo reparar su equipamiento y comprar componentes en el campamento.",
      },
      {
        tier: 3,
        skillReq: 300,
        itemName: "Banco de trabajo de anarquista",
        effect: "Habilita la fabricación de recetas avanzadas de Ingeniería desde el campamento.",
      },
    ],
  },
  {
    id: "peleteria",
    name: "Peletería",
    type: "Producción",
    category: "crafting",
    color: "#d97706",
    glow: "rgba(217, 119, 6, 0.45)",
    enabled: true,
    campBuffShort: "🔥 +5% XP Descansado",
    campBuff: "Experiencia descansada (hasta 5%)",
    campSummary: "Tienda de campaña (+5% XP descansada), Bastidor para pieles y Máquina de costura.",
    campTiers: [
      {
        tier: 1,
        skillReq: 20,
        itemName: "Tienda de campamento",
        effect: "Otorga experiencia descansada (hasta un 5% de un nivel) al descansar junto al fuego.",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Bastidor para pieles",
        effect: "Permite crear reactivos de peletería en el campamento + bono de experiencia descansada.",
      },
      {
        tier: 3,
        skillReq: 300,
        itemName: "Máquina de costura",
        effect: "Desbloquea recetas avanzadas de peletería en el campamento + experiencia descansada.",
      },
    ],
  },
  {
    id: "sastreria",
    name: "Sastrería",
    type: "Producción",
    category: "crafting",
    color: "#f472b6",
    glow: "rgba(244, 114, 182, 0.45)",
    enabled: true,
    campBuffShort: "🔥 +Espíritu",
    campBuff: "Espíritu aumentado",
    campSummary: "Estandarte de facción (+Espíritu), Rueca de reactivos y Telar portátil.",
    campTiers: [
      {
        tier: 1,
        skillReq: 20,
        itemName: "Estandarte de facción",
        effect: "Aumenta el Espíritu de todos los jugadores que descansen en el campamento.",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Rueca",
        effect: "Permite elaborar reactivos textiles en el campamento + beneficio de Espíritu.",
      },
      {
        tier: 3,
        skillReq: 300,
        itemName: "Telar",
        effect: "Despliega un Telar portátil para confeccionar recetas avanzadas + beneficio de Espíritu.",
      },
    ],
  },
  {
    id: "mineria",
    name: "Minería",
    type: "Recolección",
    category: "gathering",
    color: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.45)",
    enabled: true,
    campBuffShort: "🔥 +Poder de Ataque",
    campBuff: "Poder de ataque cuerpo a cuerpo",
    campSummary: "Magnetita (+Poder de ataque), aparición de vetas en el campamento y Fundición de magma.",
    campTiers: [
      {
        tier: 1,
        skillReq: 20,
        itemName: "Magnetita",
        effect: "Aumenta el Poder de ataque cuerpo a cuerpo de los aliados en el campamento.",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Jardín de piedra",
        effect: "Genera periódicamente una veta de mineral común en el campamento + Poder de ataque.",
      },
      {
        tier: 3,
        skillReq: 300,
        itemName: "Fundición de magma",
        effect: "Permite fundir minerales especiales y recetas avanzadas + Poder de ataque.",
      },
    ],
  },
  {
    id: "herboristeria",
    name: "Herboristería",
    type: "Recolección",
    category: "gathering",
    color: "#4ade80",
    glow: "rgba(74, 222, 128, 0.45)",
    enabled: true,
    campBuffShort: "🔥 +Intelecto",
    campBuff: "Intelecto aumentado",
    campSummary: "Vela de incienso (+Intelecto), cultivo de semillas en Invernadero e Hibridador.",
    campTiers: [
      {
        tier: 1,
        skillReq: 20,
        itemName: "Vela de incienso",
        effect: "Aumenta el Intelecto de todos los jugadores que descansen junto a la hoguera.",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Invernadero",
        effect: "Permite cultivar plantas con el tiempo a partir de semillas + beneficio de Intelecto.",
      },
      {
        tier: 3,
        skillReq: 300,
        itemName: "Hibridador de semillas",
        effect: "Multiplica o combina semillas para obtener hierbas raras + beneficio de Intelecto.",
      },
    ],
  },
  {
    id: "desuello",
    name: "Desuello",
    type: "Recolección",
    category: "gathering",
    color: "#f87171",
    glow: "rgba(248, 113, 113, 0.45)",
    enabled: true,
    campBuffShort: "🔥 +2% Crítico",
    campBuff: "+2% de Golpe crítico",
    campSummary: "Silla (+2% Golpe crítico), Guía de campo (Rastrear bestias) y Banco de trampero.",
    campTiers: [
      {
        tier: 1,
        skillReq: 20,
        itemName: "Silla de campamento",
        effect: "Otorga un +2% de probabilidad de Golpe crítico al descansar en el campamento.",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Guía de campo",
        effect: "Otorga la facultad de Rastrear bestias además del +2% de Golpe crítico.",
      },
      {
        tier: 3,
        skillReq: 300,
        itemName: "Banco de trabajo de trampero",
        effect: "Proporciona 1 trampa de caza utilizable y mantiene el +2% de Golpe crítico.",
      },
    ],
  },
  {
    id: "cocina",
    name: "Cocina",
    type: "Secundaria",
    category: "secondary",
    color: "#fb923c",
    glow: "rgba(251, 146, 60, 0.45)",
    enabled: true,
    campBuffShort: "🔥 +Aguante / Hogueras",
    campBuff: "Comida de Aguante y Hogueras (3 / 5 / 10 huecos)",
    campSummary: "Base del campamento: amplía los huecos de la hoguera (3, 5 y 10) y sirve Festines de Aguante.",
    campTiers: [
      {
        tier: 1,
        skillReq: 1,
        itemName: "Equipo de hoguera básica",
        effect: "Inicia el campamento permitiendo cocinar y colocar hasta 3 objetos de profesión.",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Hoguera de oficial y Festín de Cocinitas",
        effect: "Amplía la capacidad del campamento a 5 mejoras y ofrece comida que aumenta el Aguante.",
      },
      {
        tier: 3,
        skillReq: 220,
        itemName: "Hoguera de experto y Horno de hierro (300)",
        effect: "Amplía el campamento hasta 10 mejoras simultáneas y permite colocar el Horno de hierro al 300.",
      },
    ],
  },
  {
    id: "pesca",
    name: "Pesca",
    type: "Secundaria",
    category: "secondary",
    color: "#22d3ee",
    glow: "rgba(34, 211, 238, 0.45)",
    enabled: true,
    campBuffShort: "🔥 +8% Estadísticas",
    campBuff: "+8% a todas las estadísticas",
    campSummary: "Cuenco (+8% estadísticas), Expositor de pesca y Cabaña de pesca con cebos.",
    campTiers: [
      {
        tier: 1,
        skillReq: 20,
        itemName: "Cuenco con pescado",
        effect: "Otorga un +8% a todas las estadísticas a quienes se sienten cerca (exclusivo con Bendición de Reyes).",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Expositor de pesca",
        effect: "Permite pescar peces poco comunes durante 1 h, da cebos y mantiene el +8% de estadísticas.",
      },
      {
        tier: 3,
        skillReq: 300,
        itemName: "Cabaña de pesca",
        effect: "Permite capturar peces raros durante 1 h, da cebos y mantiene el +8% de estadísticas.",
      },
    ],
  },
  {
    id: "primeros-auxilios",
    name: "Primeros Auxilios",
    type: "Secundaria",
    category: "secondary",
    color: "#ec4899",
    glow: "rgba(236, 72, 153, 0.45)",
    enabled: true,
    campBuffShort: "🔥 +Aguante",
    campBuff: "Aguante aumentado",
    campSummary: "Equipo médico (+Aguante), Estudio sobre toxinas y Laboratorio de doctor de peste.",
    campTiers: [
      {
        tier: 1,
        skillReq: 20,
        itemName: "Equipo de primeros auxilios",
        effect: "Otorga un beneficio directo de Aguante a los jugadores que descansen en el campamento.",
      },
      {
        tier: 2,
        skillReq: 140,
        itemName: "Estudio sobre toxinas",
        effect: "Estación médica intermedia preparada con antídotos + beneficio de Aguante.",
      },
      {
        tier: 3,
        skillReq: 300,
        itemName: "Laboratorio de doctor de peste",
        effect: "Estación médica avanzada para elaborar pociones y remedios + beneficio de Aguante.",
      },
    ],
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

export function getForeverProfessionConfig(professionId: string): ForeverProfessionEntry | undefined {
  return FOREVER_PROFESSIONS_CONFIG.find((p) => p.id === professionId);
}
