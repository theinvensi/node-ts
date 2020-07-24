export const regexpAccentRemoval = (str: string = ``, type: `noOrder` | `continuous`) => {
	if (typeof str !== `string`) return str
	let dictionary = `. AaÀÁÂÃÄÅÆàáâãäåæ CcÇç Dd EeÈÉÊËẼèéêëẽ IiÌÍÎÏĨìíîïĩ NnÑñ OoÒÓÔÕÖØŒœðòóôõöø SsŠšß UuÙÚÛÜùúûüµ ZzŽž YyýÿÝŸ¥`.split(` `)
	let toReturn = str.trim().split(``).map((c) => {
		c = c.replace(/(\\)/gi, `\\$1`)
		c = c.replace(/(\()/gi, `\\$1`)
		c = c.replace(/(\))/gi, `\\$1`)
		c = c.replace(/(\[)/gi, `\\$1`)
		c = c.replace(/(\])/gi, `\\$1`)
		c = c.replace(/(\?)/gi, `\\$1`)
		c = c.replace(/(\+)/gi, `\\$1`)
		dictionary.forEach((_) => {
			if ([`*`, `[`, `]`].includes(c)) return c
			c = _.match(new RegExp(c, `gi`)) ? `[${_}]` : c
		})
		return c
	}).join(``)
	toReturn = toReturn
		.replace(/\*/gi, `\\*`)
	if (type === `noOrder`) toReturn = toReturn.split(` `).map(i => `(${i})`).join(`|`)
	if (type === `continuous`) toReturn = toReturn.split(` `).map(i => `(${i})`).join(`.*`)
	return toReturn
}