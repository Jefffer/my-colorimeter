/* global process */
import { readFileSync } from 'node:fs'
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.API_KEY
const genAI = new GoogleGenerativeAI(apiKey || '')
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

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

function extractJson(text) {
	const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '')
	const match = trimmed.match(/\{[\s\S]*\}/)

	if (!match) {
		throw new Error('Gemini no devolvió JSON válido')
	}

	return JSON.parse(match[0])
}

function previewText(text, maxLength = 2000) {
	const normalized = String(text || '').trim()
	return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}\n... [truncated]` : normalized
}

function isQuotaError(error) {
	const message = error instanceof Error ? error.message : String(error)
	return /429|too many requests|quota|rate limit/i.test(message)
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

		if (!image) {
			res.status(400).json({ error: 'Debes enviar una imagen en base64 o data URL.' })
			return
		}

		const base64Image = image.includes(',') ? image.split(',')[1] : image
		const prompt = readFileSync(new URL('./prompt.txt', import.meta.url), 'utf8')

		const result = await model.generateContent([
			prompt,
			{
				inlineData: {
					data: base64Image,
					mimeType,
				},
			},
		])

		const text = result.response.text()
		let analysis

		try {
			analysis = extractJson(text)
		} catch (parseError) {
			res.status(422).json({
				error: parseError instanceof Error ? parseError.message : 'Gemini respondió algo que no es JSON válido.',
				rawResponse: previewText(text),
			})
			return
		}

		res.status(200).json({
			analysis,
			rawResponse: previewText(text),
			fileName,
		})
	} catch (error) {
		if (isQuotaError(error)) {
			res.status(429).json({
				error: 'Gemini devolvió un límite de cuota. Verifica que el proyecto correcto tenga Gemini 2.5 Flash habilitado y que el billing/cuota del proyecto sea suficiente.',
			})
			return
		}

		res.status(500).json({
			error: error instanceof Error ? error.message : 'No se pudo generar el reporte',
		})
	}
}