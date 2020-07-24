import { Socket, Server as SocketIOServer } from 'socket.io'

import { ApiErrorRepo, ApiError } from '../models/ApiError'

let ws: SocketIOServer

export const setWS = (_ws: SocketIOServer) => ws = _ws

export const getWS = () => ws

export interface SocketContext {
	sessionToken?: string
	userAgent: any
	remoteIP: string
}

export interface CustomSocket extends Socket {
	context: SocketContext
}

type MiddlewareLayer = (client: CustomSocket, args: any) => Promise<any>
export const runMiddlewares = async (client: CustomSocket, event: string | undefined, layers: MiddlewareLayer[]) => {
	const run = async (args?: any) => {
		try {
			for (const [index, layer] of layers.entries()) {
				if (typeof layer === `function`) await layer(client, args)
			}
		} catch (e) {
			const apiError = new ApiErrorRepo({
				headers: client.handshake.headers,
				error: (e.stack ? e.stack : new Error(e).stack).replace(new RegExp(`Error: `, `gi`), ``),
				ws: {
					args,
					event,
					namespace: client.nsp.name,
				},
				userAgent: client.context.userAgent,
				remoteIP: client.context.remoteIP,
				sessionToken: client.context.sessionToken
			} as ApiError)
			await apiError
				.save()
		}
	}
	if (event) {
		client.on(event, async (args: any) => await run(args))
	} else {
		await run()
	}
}