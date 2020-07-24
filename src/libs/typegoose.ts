export const schemaOptionsGenerator = (collectioName: string) => ({
	options: { allowMixed: 0 },
	schemaOptions: {
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		collection: collectioName,
		versionKey: false
	}
})

export const errorHandlerGenerator = function (error: any, res: any, next: any) {
	if (error.name === 'MongoError' && error.code === 11000) {
		const fieldName = `${Object.keys(error.keyValue).join(`_`)}`.toUpperCase()
		next(new Error(`DUPLICATED_${fieldName}`))
	} else {
		next()
	}
}