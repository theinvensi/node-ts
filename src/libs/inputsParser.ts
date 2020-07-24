import * as classValidator from 'class-validator'

enum ESort {
	ASC = 1,
	DES = -1
}

export class RequestInputParser {
	@classValidator.IsOptional()
	@classValidator.IsNumber()
	@classValidator.Min(0)
	skip?: number

	@classValidator.IsOptional()
	@classValidator.IsNumber()
	@classValidator.Min(1)
	limit?: number

	@classValidator.IsOptional()
	@classValidator.IsEnum(ESort)
	sort?: number

	constructor(raw: any) {
		Object.assign(this, raw)
		this.skip = raw.skip ? parseInt(raw.skip) : 0
		this.limit = raw.skip ? parseInt(raw.limit) : 100
		this.sort = raw.sort ? parseInt(raw.sort) : 1
		this.initNested()
	}

	public initNested() { }

	public async validate() {
		const parseError = (e: classValidator.ValidationError, path: string[] = []): string => {
			if (e.children && e.children.length > 0) {
				path.push(e.property)
				return parseError(e.children[0], path)
			}
			if (path.length > 0) return `${path.join(`.`)}.${Object.values(e.constraints).pop()}`
			return `${Object.values(e.constraints).pop()}`
		}
		const validation = classValidator.validateSync(this)
		if (validation.length > 0) throw new Error(parseError(validation[0]))
	}
}