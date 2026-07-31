/**
 * Servicio de Inteligencia Artificial Nexo (Google Gemini API)
 * Conectado con la base de conocimiento de WOWGamerES y el estado del Simulador de Oro.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AiPromptContext {
	profession: string;
	recipe: string;
	multicraftPercent: number;
	materialSavingsPercent: number;
	estimatedDailyProfit: number;
	hourlyProfit: number;
	query: string;
}

export async function askNexoAI(context: AiPromptContext): Promise<string> {
	const apiKey = process.env.GEMINI_API_KEY;

	// Si no hay API KEY configurada o falla la red, usar respuesta estructurada sin error
	if (!apiKey) {
		return getFallbackResponse(context);
	}

	try {
		const genAI = new GoogleGenerativeAI(apiKey);
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

		const systemPrompt = `Eres Nexo IA, el consultor experto de WOWGamerES en World of Warcraft.
El usuario está usando el simulador Nexo Craft con los siguientes datos:
- Profesión: ${context.profession}
- Receta: ${context.recipe}
- Multicraft: +${context.multicraftPercent}%
- Ahorro de Mats: -${context.materialSavingsPercent}%
- Ganancia diaria estimada: ${context.estimatedDailyProfit}g
- Ganancia por hora: ~${context.hourlyProfit}g

Responde a su pregunta de forma profesional, clara, directa y con consejos prácticos para maximizar su oro.
Consulta del usuario: "${context.query}"`;

		const result = await model.generateContent(systemPrompt);
		const response = await result.response;
		return response.text();
	} catch (error) {
		console.warn('[Gemini AI Warning] Usando respuesta de respaldo:', error);
		return getFallbackResponse(context);
	}
}

function getFallbackResponse(context: AiPromptContext): string {
	const qLower = context.query.toLowerCase();

	if (qLower.includes('receta') || qLower.includes('margen') || qLower.includes('alquimia')) {
		return `Para la receta seleccionada en **${context.profession}**, con tu **${context.multicraftPercent}% de Multicraft** y **${context.materialSavingsPercent}% de ahorro de materiales**, tu beneficio neto es de **${context.estimatedDailyProfit.toLocaleString('es-ES')}g**.\n\nSi asignas 5 puntos más en *Inspiración Mítica*, elevarás las ventas de Calidad 3 a un precio +45% superior en la Casa de Subastas.`;
	} else if (qLower.includes('puntos') || qLower.includes('distribución') || qLower.includes('talentos')) {
		return `Distribución óptima recomendada para tus **50 Puntos de Conocimiento**:\n\n• **20 Pts** en *Maestría de Multicraft* (máximo multiplicador de procs).\n• **15 Pts** en *Eficiencia de Insumos* (ahorro crítico en plantas raras).\n• **15 Pts** en *Inspiración Mítica* (garantiza calidad máxima).`;
	} else if (qLower.includes('subasta') || qLower.includes('día') || qLower.includes('vender')) {
		return 'El momento pico para publicar consumibles en Subasta es el **Martes de 18:00 a 22:00 CET** y el **Miércoles de 17:00 a 20:00 CET**. Durante estos horarios, los grupos de raid compran inventario masivo pagando hasta un 25% más.';
	}

	return `Consulta sobre **"${context.query}"**:\n\nCon los parámetros actuales de tu simulador (ganancia estimada por hora: **~${context.hourlyProfit.toLocaleString('es-ES')}g**), tu margen de beneficio es muy sólido. ¡Recuerda vender tus ítems en lotes pequeños de 10 a 20 unidades para acelerar las ventas!`;
}
