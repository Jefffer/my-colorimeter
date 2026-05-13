/* global process */
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
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

	if (best.length !== 6 || neutral.length !== 4 || avoid.length !== 3) {
		throw new Error('Gemini no devolvió exactamente 6 colores mejores, 4 neutrales y 3 a evitar')
	}

	return {
		season: String(report?.season || '').trim(),
		undertone: String(report?.undertone || '').trim(),
		summary: String(report?.summary || '').trim(),
		why_this_works: String(report?.why_this_works || '').trim(),
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
			const parsed = extractJson(response?.text || '')

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
					best_options: [],
					neutral_options: [],
					avoid_options: [],
				}
			} else {
				// Normal path: validate the full report and attach validity/photo_type if provided
				const validated = validateReport(parsed)
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