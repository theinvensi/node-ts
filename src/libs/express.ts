import { Request, Response, NextFunction, Express as ExpressInstance } from 'express'
import * as classValidator from 'class-validator'

import { ApiError } from '../models/ApiError'

let server: ExpressInstance

export const getExpress = () => server

export const setExpress = (_server: ExpressInstance) => server = _server

export interface RequestContext {
	sessionToken?: string
	userAgent: any
	remoteIP: string
}

export interface CustomRequest extends Request {
	context: RequestContext
}

export interface ResponseContent {
	success: boolean
	payload?: any
}

export interface CustomResponse extends Response {
	send: (content: ResponseContent) => any
	json: (content: ResponseContent) => any
}

export const createHTTPHandler = (callback: (req: CustomRequest, res: CustomResponse, next?: NextFunction) => void, isMiddleware?: boolean) => async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
	try {
		const payload = await callback(req, res, isMiddleware ? next : undefined)
		if (!isMiddleware) {
			res
				.status(200)
				.json({
					success: true,
					payload
				})
		}
	} catch (e) {
		const apiError = new ApiError.model({
			headers: req.headers,
			error: (e.stack ? e.stack : new Error(e).stack).replace(new RegExp(`Error: `, `gi`), ``),
			http: {
				url: `${req.protocol}://${req.get('host')}${req.originalUrl}`
			},
			userAgent: req.context.userAgent,
			remoteIP: req.context.remoteIP,
			sessionToken: req.context.sessionToken
		} as ApiError)
		await apiError
			.save()
		res
			.status(500)
			.json({
				success: false,
				payload: e.toString().replace(new RegExp(`Error: `, `gi`), ``)
			})
	}
}

export class RequestInputParser {
	constructor(req: CustomRequest) {
		Object.assign(this, {
			...req.params,
			...req.body
		})
		this.initNested()
	}

	public initNested() { }

	private parseClassValidationError(error: any, parents?: string[]): any {
		if (
			Array.isArray(error.children)
			&& error.children.length > 0
		) {
			if (error.property) parents = [...parents, error.property]
			return this.parseClassValidationError(error.children[0], parents)
		}
		parents = [...parents, error.property]
		let msg = Object.values(error.constraints)[0] as string
		msg = msg.replace(error.property, ``).trim()
		msg = `${parents.join(`.`)} ${msg}`
		return msg
	}

	public async validate() {
		const validationErrors = await classValidator.validate(this)
		if (validationErrors.length > 0) {
			const error = this.parseClassValidationError(validationErrors[0])
			throw new Error(error)
		}
	}
}