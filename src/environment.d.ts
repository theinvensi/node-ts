declare global {
	namespace NodeJS {
		interface ProcessEnv {
			HTTPS_CERT_FILE: string
			HTTPS_KEY_FILE: string
			JWT_SECRET: string
			PORT: string
			MONGO_URL: string
			AWS_S3_ACCESS_KEY_ID: string
			AWS_S3_SECRET_ACCESS_KEY: string
			AWS_S3_REGION: string
			AWS_S3_BUCKET_VSNODE_RAW: string
			AWS_S3_BUCKET_VSNODE_COMPILED: string
			AWS_S3_BUCKET_USER_PROFILE_PICTURE: string
			AWS_S3_BUCKET_BUSINESS_LOGO_PICTURE: string
		}
	}
}

export { }