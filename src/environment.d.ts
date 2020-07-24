declare global {
	namespace NodeJS {
		interface ProcessEnv {
			HTTPS_CERT_FILE: string
			HTTPS_KEY_FILE: string
			PORT: string
			MONGO_URL: string
		}
	}
}

export { }