import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import https from 'https'
import http, { Server as HttpServer } from 'http'
import fs from 'fs'
import path from 'path'
import socketio from 'socket.io'
import * as dotenv from 'dotenv'

const isDev = process.env.DEV === `true`
switch (isDev) {
	case true:
		if (!fs.existsSync(`.env.development`)) throw new Error(`MISSING_ENV_FILE`)
		dotenv.config({ path: path.join(`.env.development`) })
		break
	case false:
		if (!fs.existsSync(`.env.production`)) throw new Error(`MISSING_ENV_FILE`)
		dotenv.config({ path: path.join(`.env.production`) })
		break
}

import { setWS } from './libs/ws'
import { getExpress, setExpress, CustomRequest, CustomResponse } from './libs/express'
import { requestNormalizer } from './middlewares/requestNormalizer'

class API {
	private api: HttpServer

	constructor() {
		const self = this

		self.initExpressServer()
		self.startHttpServer()
		self.initWebSocket()
		self.setRoutes()
	}

	private setRoutes() {
		const self = this

		getExpress().all(`*`, self.ReqNotFoundHandler)
		console.log(`Routes - [OK]`)
	}

	private ReqNotFoundHandler(req: CustomRequest, res: CustomResponse) {
		res.status(404).json({
			success: false,
			payload: `HTTP404`
		})
	}

	private initExpressServer() {
		setExpress(express())
		console.log(`Express - [OK]`)
		getExpress().use(helmet())
		getExpress().use(cors({ origin: true, credentials: true }))
		getExpress().use(express.json())
		getExpress().set('trust proxy', 1)
		getExpress().use(requestNormalizer.http)
	}

	private async initWebSocket() {
		const self = this

		setWS(socketio.listen(self.api))
		console.log(`Websocket - [OK]`)
	}

	private startHttpServer() {
		const self = this

		self.api = isDev
			? http.createServer(getExpress())
			: https.createServer({
				cert: fs.readFileSync(process.env.HTTPS_CERT_FILE),
				key: fs.readFileSync(process.env.HTTPS_KEY_FILE),
			}, getExpress())
		self.api.on(`listening`, () => {
			console.log(`HTTP/HTTPS - [OK]`)
			console.log(`Listeinning on port ${process.env.PORT}...`)
		})
		self.api.listen(process.env.PORT)
	}
}

new API()