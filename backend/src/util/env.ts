import logger from './logger'
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
	logger.debug('Using .env file to supply config environment variables')
	dotenv.config({ path: '.env' })
} else {
	logger.debug('Using .env.example file to supply config environment variables')
	dotenv.config({ path: '.env.example' })
}
export const ENVIRONMENT = process.env.NODE_ENV
const isProductionEnvironment = ENVIRONMENT === 'production' // Anything else is treated as 'dev'

export const MONGODB_URI = isProductionEnvironment ? process.env['MONGODB_URI'] : process.env['MONGODB_URI_LOCAL']

if (!MONGODB_URI) {
	logger.error('No mongo connection string. Set MONGODB_URI environment variable.')
	process.exit(1)
}
