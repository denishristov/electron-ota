import dotenv from 'dotenv'
import fs from 'fs'
import invariant from 'invariant'

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

export const MONGODB_URI = process.env.MONGODB_URI

export const PORT = process.env.PORT || 4000

export const PASS_SECRET_KEY = process.env.PASS_SECRET_KEY
invariant(PASS_SECRET_KEY, 'PASS_SECRET_KEY is undefined')

export const REGISTER_KEY = process.env.REGISTER_KEY
invariant(REGISTER_KEY, 'REGISTER_KEY is undefined')

export const AWS_CREDENTIALS = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
}

invariant(AWS_CREDENTIALS.accessKeyId, 'AWS_ACCESS_KEY_ID is undefined')
invariant(AWS_CREDENTIALS.secretAccessKey, 'AWS_SECRET_ACCESS_KEY is undefined')
invariant(AWS_CREDENTIALS.region, 'AWS_REGION is undefined')

export const S3_CONFIG = {
	ACL: process.env.S3_ACL,
	Bucket: process.env.S3_BUCKET,
	Expires: parseInt(process.env.S3_EXPIRES, 10),
}

invariant(S3_CONFIG.ACL, 'S3_ACL is undefined')
invariant(S3_CONFIG.Bucket, 'S3_BUCKET is undefined')
invariant(S3_CONFIG.Expires, 'S3_EXPIRES is undefined or is NaN')

if (!MONGODB_URI) {
	logger.error('No mongo connection string. Set MONGODB_URI environment variable.')
	process.exit(1)
}

export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN
invariant(CLIENT_ORIGIN, 'CLIENT_ORIGIN is undefined')
