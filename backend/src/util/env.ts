import dotenv from 'dotenv'
import fs from 'fs'
import logger from './logger'

if (fs.existsSync('.env')) {
	logger.debug('Using .env file to supply config environment variables')
	dotenv.config({ path: '.env' })
} else {
	logger.debug('Using .env.example file to supply config environment variables')
	dotenv.config({ path: '.env.example' })
}
export const ENVIRONMENT = process.env.NODE_ENV || 'development'
const isProductionEnvironment = ENVIRONMENT === 'production' // Anything else is treated as 'dev'
export const MONGODB_URI = isProductionEnvironment ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL
export const AUTH_PRIVATE_KEY = fs.readFileSync('./private.key', 'utf8')
export const AUTH_PUBLIC_KEY = fs.readFileSync('./public.key', 'utf8')
export const AUTH_TOKEN_SALT = process.env.AUTH_TOKEN_SALT
export const PORT = process.env.PORT || 4000

if (!MONGODB_URI) {
	logger.error('No mongo connection string. Set MONGODB_URI environment variable.')
	process.exit(1)
}
