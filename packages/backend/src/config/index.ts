import dotenv from 'dotenv'
import fs from 'fs'
import logger from '../util/logger'

if (fs.existsSync('.env')) {
	logger.debug('Using .env file to supply config environment variables')
	dotenv.config({ path: '.env' })
} else {
	logger.debug('Using .env.example file to supply config environment variables')
	dotenv.config({ path: '.env.example' })
}

export const ENVIRONMENT = process.env.NODE_ENV || 'development'

export const isProduction = ENVIRONMENT === 'production' // Anything else is treated as 'dev'

export const MONGODB_URI = isProduction ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL

export const PORT = process.env.PORT || 4000

export const PASS_SECRET_KEY = process.env.PASS_SECRET_KEY

export const REGISTER_KEY = process.env.REGISTER_KEY

export const AWS_CREDENTIALS = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
}

export const S3_CONFIG = {
	ACL: process.env.S3_ACL,
	Bucket: process.env.S3_BUCKET,
	Expires: parseInt(process.env.S3_EXPIRES, 10),
}

if (!MONGODB_URI) {
	logger.error('No mongo connection string. Set MONGODB_URI environment variable.')
	process.exit(1)
}
