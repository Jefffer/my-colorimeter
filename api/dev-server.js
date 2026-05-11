/* global process */
/* Servidor de desarrollo local para la API */
import http from 'node:http'
import { URL, fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const PORT = 3001
const logFilePath = process.env.GEMINI_DEBUG_LOG_FILE || join(dirname(fileURLToPath(import.meta.url)), 'debug-log.jsonl')

process.env.GEMINI_DEBUG_LOG_FILE = logFilePath

const { default: handler } = await import('./generate.js')

function createResponseAdapter(res) {
	return {
		status(code) {
			res.statusCode = code
			return this
		},
		setHeader(name, value) {
			res.setHeader(name, value)
			return this
		},
		json(payload) {
			if (!res.getHeader('Content-Type')) {
				res.setHeader('Content-Type', 'application/json')
			}
			res.end(JSON.stringify(payload))
		},
		end(payload) {
			res.end(payload)
		},
	}
}

const server = http.createServer(async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

	if (req.method === 'OPTIONS') {
		res.writeHead(200)
		res.end()
		return
	}

	const url = new URL(req.url, `http://${req.headers.host}`)
	const adapter = createResponseAdapter(res)

	if (url.pathname.startsWith('/api/generate')) {
		try {
			await handler(req, adapter)
		} catch (error) {
			console.error('API Error:', error)
			if (!res.headersSent) {
				res.writeHead(500, { 'Content-Type': 'application/json' })
				res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }))
			}
		}
		return
	}

	res.writeHead(404, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(PORT, () => {
	console.log(`✓ API dev server running on http://localhost:${PORT}`)
	console.log(`✓ POST /api/generate ready`)
	console.log(`✓ Logs: ${logFilePath}`)
	console.log(`✓ Frontend should proxy to http://localhost:${PORT}`)
})

server.on('error', (error) => {
	console.error('Server error:', error)
	process.exit(1)
})
