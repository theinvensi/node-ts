import useragent from 'useragent'
import cookie from 'cookie'

import { createHTTPHandler } from '../libs/express'
import { CustomSocket } from '../libs/ws'

export const requestNormalizer = {
	ws: async (client: CustomSocket) => {
		let cookies = cookie.parse(client.handshake.headers.cookie || '')
		const agent = useragent.parse(client.handshake.headers[`user-agent`])
		client.context = {
			sessionToken: cookies.sessionToken,
			userAgent: {
				browser: {
					family: agent.family,
					version: `${agent.major}.${agent.minor}.${agent.patch}`,
				},
				device: {
					family: agent.device.family,
					version: `${agent.device.major}.${agent.device.minor}.${agent.device.patch}`,
				},
				os: {
					family: agent.os.family,
					version: `${agent.os.major}.${agent.os.minor}.${agent.os.patch}`,
				},
			},
			remoteIP: client.client.conn.remoteAddress
		}
	},
	http: createHTTPHandler((req, res, next) => {
		const agent = useragent.parse(req.headers[`user-agent`])
		let cookies = cookie.parse(req.headers.cookie || '')
		req.context = {
			sessionToken: cookies.sessionToken,
			userAgent: {
				browser: {
					family: agent.family,
					version: `${agent.major}.${agent.minor}.${agent.patch}`,
				},
				device: {
					family: agent.device.family,
					version: `${agent.device.major}.${agent.device.minor}.${agent.device.patch}`,
				},
				os: {
					family: agent.os.family,
					version: `${agent.os.major}.${agent.os.minor}.${agent.os.patch}`,
				},
			},
			remoteIP: `${req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.headers.remoteIP || req.headers.remoteip}`
		}
		next()
	}, true)
}