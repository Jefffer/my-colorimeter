/* global process */
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI } from '@google/genai'

const localSecretsFilePath = fileURLToPath(new URL('./local-secrets.local', import.meta.url))

function readLocalApiKey() {
	if (!existsSync(localSecretsFilePath)) return ''

	try {
		const rawContents = readFileSync(localSecretsFilePath, 'utf8').trim()
		if (!rawContents) return ''

		const parsed = JSON.parse(rawContents)
		return String(parsed?.GEMINI_API_KEY || parsed?.apiKey || parsed?.geminiApiKey || '').trim()
	} catch {
		return ''
	}
}

const apiKey =
	process.env.GEMINI_API_KEY ||
	process.env.GOOGLE_AI_STUDIO_API_KEY ||
	process.env.API_KEY ||
	readLocalApiKey()
const genAI = new GoogleGenAI({ apiKey: apiKey || '' })
const primaryModel = 'gemini-3-flash-preview'
const fallbackModel = 'gemini-2.5-flash'

function getLogFilePath() {
	return process.env.GEMINI_DEBUG_LOG_FILE || ''
}

function redactImageValue(image) {
	if (typeof image !== 'string') return image
	return image.length > 120 ? `${image.slice(0, 120)}... [redacted]` : image
}

function writeDebugLog(entry) {
	const logFilePath = getLogFilePath()
	if (!logFilePath) return

	const payload = {
		timestamp: new Date().toISOString(),
		...entry,
	}

	appendFileSync(logFilePath, `${JSON.stringify(payload)}\n`, 'utf8')
}

function readBody(req) {
	if (req.body) {
		if (typeof req.body === 'string') return JSON.parse(req.body)
		return req.body
	}

	return new Promise((resolve, reject) => {
		let raw = ''

		req.on('data', (chunk) => {
			raw += chunk
		})

		req.on('end', () => {
			try {
				resolve(raw ? JSON.parse(raw) : {})
			} catch (error) {
				reject(error)
			}
		})

		req.on('error', reject)
	})
}

function previewText(text, maxLength = 2000) {
	const normalized = String(text || '').trim()
	return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}\n... [truncated]` : normalized
}

function hashPrompt(promptText) {
	return createHash('sha256').update(String(promptText || '')).digest('hex').slice(0, 12)
}

function hasText(value) {
	return typeof value === 'string' && value.trim().length > 0
}

function getMissingSupplementalFields(report) {
	const missing = []

	if (!hasText(report?.contrast_level)) missing.push('contrast_level')
	if (!report?.best_metals || !hasText(report.best_metals.primary) || !hasText(report.best_metals.reason)) missing.push('best_metals')
	if (!report?.makeup_tips || !hasText(report.makeup_tips.lipstick) || !hasText(report.makeup_tips.blush)) missing.push('makeup_tips')
	if (!hasText(report?.hair_color_advice)) missing.push('hair_color_advice')
	if (!hasText(report?.face_shape)) missing.push('face_shape')
	if (
		!Array.isArray(report?.hair_styles) ||
		report.hair_styles.length !== 3 ||
		report.hair_styles.some((item) => !hasText(item?.style) || !hasText(item?.reason))
	) {
		missing.push('hair_styles')
	}
	if (!report?.glasses_analysis || !hasText(report.glasses_analysis.frame_shape) || !hasText(report.glasses_analysis.frame_color) || !hasText(report.glasses_analysis.tip)) {
		missing.push('glasses_analysis')
	}

	return missing
}

function buildSupplementalCompletionPrompt(report, missingFields) {
	return [
		'You are completing a previously returned Spanish JSON report for the same image.',
		`The report is missing these required fields: ${missingFields.join(', ')}.`,
		'Return ONLY a valid JSON object with ONLY the missing fields.',
		'Do not repeat the other fields.',
		'Do not add markdown, code fences, or explanations.',
		'Keep the values consistent with the rest of the report.',
		'Use Spanish.',
		'Current report:',
		JSON.stringify(report, null, 2),
	].join('\n')
}

function extractJson(text) {
	const normalized = String(text || '').trim().replace(/^```json\s*/i, '').replace(/^```/i, '').replace(/```$/i, '')
	const match = normalized.match(/\{[\s\S]*\}/)

	if (!match) {
		throw new Error('Gemini no devolvió un JSON válido')
	}

	return JSON.parse(match[0])
}

function validateReport(report) {
	const best = Array.isArray(report?.best_options) ? report.best_options : []
	const neutral = Array.isArray(report?.neutral_options) ? report.neutral_options : []
	const avoid = Array.isArray(report?.avoid_options) ? report.avoid_options : []
	const missingSupplementalFields = getMissingSupplementalFields(report)

	if (best.length !== 6 || neutral.length !== 4 || avoid.length !== 3) {
		throw new Error('Gemini no devolvió exactamente 6 colores mejores, 4 neutrales y 3 a evitar')
	}

	if (missingSupplementalFields.length > 0) {
		throw new Error(`Gemini no devolvió los campos requeridos: ${missingSupplementalFields.join(', ')}`)
	}

	return {
		season: String(report?.season || '').trim(),
		undertone: String(report?.undertone || '').trim(),
		contrast_level: String(report?.contrast_level || '').trim(),
		summary: String(report?.summary || '').trim(),
		why_this_works: String(report?.why_this_works || '').trim(),
		face_shape: String(report?.face_shape || '').trim(),
		hair_styles: Array.isArray(report?.hair_styles)
			? report.hair_styles.map((item) => ({
				style: String(item?.style || '').trim(),
				reason: String(item?.reason || '').trim(),
			}))
			: [],
		glasses_analysis: report?.glasses_analysis ? {
			frame_shape: String(report.glasses_analysis.frame_shape || '').trim(),
			frame_color: String(report.glasses_analysis.frame_color || '').trim(),
			tip: String(report.glasses_analysis.tip || '').trim(),
		} : null,
		best_metals: report?.best_metals ? {
			primary: String(report.best_metals.primary || '').trim(),
			reason: String(report.best_metals.reason || '').trim(),
		} : null,
		makeup_tips: report?.makeup_tips ? {
			lipstick: String(report.makeup_tips.lipstick || '').trim(),
			blush: String(report.makeup_tips.blush || '').trim(),
		} : null,
		hair_color_advice: String(report?.hair_color_advice || '').trim(),
		best_options: best.map((item) => ({
			name: String(item?.name || '').trim(),
			hex: String(item?.hex || '').trim(),
			reason: String(item?.reason || '').trim(),
		})),
		neutral_options: neutral.map((item) => ({
			name: String(item?.name || '').trim(),
			hex: String(item?.hex || '').trim(),
			reason: String(item?.reason || '').trim(),
		})),
		avoid_options: avoid.map((item) => ({
			name: String(item?.name || '').trim(),
			hex: String(item?.hex || '').trim(),
			reason: String(item?.reason || '').trim(),
		})),
	}
}

async function generateWithModel(model, prompt, base64Image, mimeType) {
	return genAI.models.generateContent({
		model,
		contents: [
			prompt,
			{
				inlineData: {
					data: base64Image,
					mimeType,
				},
			},
		],
		config: {
			responseMimeType: 'application/json',
			temperature: 0.2,
		},
	})
}

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '10mb',
		},
	},
}

export default async function handler(req, res) {
	if (!apiKey) {
		res.status(500).json({ error: 'Falta configurar GEMINI_API_KEY en el servidor.' })
		return
	}

	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST')
		res.status(405).json({ error: 'Method not allowed' })
		return
	}

	try {
		const body = await readBody(req)
		const { image, mimeType = 'image/jpeg', fileName = 'image' } = body || {}
		writeDebugLog({
			type: 'request',
			method: req.method,
			fileName,
			mimeType,
			imageLength: typeof image === 'string' ? image.length : 0,
			imagePreview: redactImageValue(image),
		})

		if (!image) {
			const payload = { error: 'Debes enviar una imagen en base64 o data URL.' }
			writeDebugLog({ type: 'response', status: 400, payload })
			res.status(400).json(payload)
			return
		}

		const base64Image = image.includes(',') ? image.split(',')[1] : image
		const prompt = readFileSync(new URL('./prompt.txt', import.meta.url), 'utf8')
		const promptHash = hashPrompt(prompt)
		writeDebugLog({
			type: 'prompt_loaded',
			promptHash,
			promptHasHairStyles: prompt.includes('"hair_styles"'),
			promptHasGlasses: prompt.includes('"glasses_analysis"'),
			promptHasFaceShape: prompt.includes('"face_shape"'),
		})

		let response
		let usedModel = primaryModel
		try {
			response = await generateWithModel(primaryModel, prompt, base64Image, mimeType)
		} catch (geminiError) {
			try {
				response = await generateWithModel(fallbackModel, prompt, base64Image, mimeType)
				usedModel = fallbackModel
			} catch (fallbackError) {
				const rawResponse = fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
				const payload = {
					error: 'No se pudo generar el reporte con Gemini 3 Flash Preview ni con Gemini 2.5 Flash.',
					rawResponse: previewText(rawResponse),
				}
				writeDebugLog({ type: 'response', status: 500, model: fallbackModel, payload, primaryError: previewText(geminiError instanceof Error ? geminiError.message : String(geminiError)) })
				res.status(500).json(payload)
				return
			}
		}

		const rawResponse = previewText(response?.text || '')
		let report

		try {
			let parsed = extractJson(response?.text || '')

			// If model explicitly indicates the image is not analyzable, return early with empty fields
			const validity = parsed?.validity || null
			const photoType = parsed?.photo_type || 'other'

			if (validity && validity.analyzable === false) {
				report = {
					photo_type: photoType,
					validity: {
						is_person: Boolean(validity.is_person === true),
						analyzable: false,
						reason: String(validity.reason || 'Imagen no adecuada para análisis').trim(),
					},
					season: '',
					undertone: '',
					summary: '',
					why_this_works: '',
					face_shape: '',
					hair_styles: [],
					glasses_analysis: {},
					best_options: [],
					neutral_options: [],
					avoid_options: [],
				}
			} else {
				let validated

				try {
					validated = validateReport(parsed)
				} catch (validationError) {
					const missingSupplementalFields = getMissingSupplementalFields(parsed)

					if (missingSupplementalFields.length > 0) {
						writeDebugLog({
							type: 'supplemental_retry',
							model: usedModel,
							missingSupplementalFields,
						})

						const supplementalResponse = await generateWithModel(
							usedModel,
							buildSupplementalCompletionPrompt(parsed, missingSupplementalFields),
							base64Image,
							mimeType,
						)

						const supplementalParsed = extractJson(supplementalResponse?.text || '')
						parsed = {
							...parsed,
							...supplementalParsed,
						}
						validated = validateReport(parsed)
					} else {
						throw validationError
					}
				}

				// Normal path: validate the full report and attach validity/photo_type if provided
				report = {
					photo_type: photoType || 'portrait',
					validity: {
						is_person: validity?.is_person === false ? false : true,
						analyzable: true,
						reason: '',
					},
					...validated,
				}
			}
		} catch (parseError) {
			const payload = {
				error: parseError instanceof Error ? parseError.message : 'Gemini respondió algo que no es JSON válido.',
				rawResponse,
			}
			writeDebugLog({ type: 'response', status: 422, payload })
			res.status(422).json(payload)
			return
		}

		const payload = {
			report,
			rawResponse,
			fileName,
			model: usedModel,
		}
		writeDebugLog({ type: 'response', status: 200, model: usedModel, payload })
		res.status(200).json(payload)
	} catch (error) {
		const payload = {
			error: error instanceof Error ? error.message : 'No se pudo generar el reporte',
			rawResponse: previewText(error instanceof Error ? error.message : String(error)),
		}
		writeDebugLog({ type: 'response', status: 500, payload })
		res.status(500).json(payload)
	}
}