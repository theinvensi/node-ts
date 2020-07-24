import * as classValidator from 'class-validator'

export enum PaginationErrors {
	INVALID_SKIP = 'INVALID_SKIP',
	INVALID_LIMIT = 'INVALID_LIMIT'
}

const parseClassValidationError: (error: any, parents?: string[]) => any = (error, parents = []) => {
	if (
		Array.isArray(error.children)
		&& error.children.length > 0
	) {
		if (error.property) parents = [...parents, error.property]
		return parseClassValidationError(error.children[0], parents)
	}
	parents = [...parents, error.property]
	const fieldName = parents.join(`.`).toUpperCase()
	let msg = Object.values(error.constraints).pop() as string
	msg = msg.replace(`{field_name}`, fieldName)
	return msg
}

export abstract class BaseInputParser {
	constructor(inputs: any) {
		Object.assign(this, { ...inputs })
		this.skip = this.skip ? parseInt(inputs.skip) : 0
		this.limit = this.limit ? parseInt(inputs.limit) : 100
		this.initNested()
	}

	@classValidator.IsOptional()
	@classValidator.IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false }, { message: PaginationErrors.INVALID_SKIP })
	@classValidator.Min(0, { message: PaginationErrors.INVALID_SKIP })
	skip: number

	@classValidator.IsOptional()
	@classValidator.IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false }, { message: PaginationErrors.INVALID_LIMIT })
	@classValidator.Min(1, { message: PaginationErrors.INVALID_LIMIT })
	limit: number

	public initNested() { }

	public async validate() {
		const validationErrors = await classValidator.validate(this)
		if (validationErrors.length > 0) {
			const error = parseClassValidationError(validationErrors[0])
			throw new Error(error)
		}
	}
}

