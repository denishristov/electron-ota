import fs from 'fs'
import util from 'util'
import path from 'path'
import crypto from 'crypto'
import { IUpdateServiceOptions } from './interfaces'
import { app } from 'electron'

export const exists = util.promisify(fs.exists)
export const readdir = util.promisify(fs.readdir)
export const unlink = util.promisify(fs.unlink)

export function hashFile(path: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash('sha256')
		const rs = fs.createReadStream(path)

		rs.on('error', reject)
		rs.on('data', (chunk) => hash.update(chunk))
		rs.on('end', () => resolve(hash.digest('base64')))
	})
}

export function hashFileSync(path: string): string {
	const file = fs.readFileSync(path)
	const hash = crypto.createHash('sha256')
		.update(file)
		.digest('base64')

	return hash
}

export function uuid(): string {
	return crypto.randomBytes(32).toString('base64')
}

function getVersion(): string | null {
	const packageJSON = require(path.join(__dirname, '..', '..', '..', 'package.json'))

	return (Boolean(packageJSON) && packageJSON.version) || null
}

export function parseConfigFile(): IUpdateServiceOptions | null {
	try {
		return require(path.join(__dirname, '..', '..', '..', 'electron-ota.config.json'))
	} catch {
		console.log('No electron-ota.config.json present.')

		return null
	}
}

export function normalizeOptions(options: IUpdateServiceOptions): IUpdateServiceOptions {
	return {
		...options,
		userDataPath: options.userDataPath || app.getPath('userData'),
		checkHashAfterDownload: options.checkHashAfterDownload === void 0
			? true
			: options.checkHashAfterDownload,
		checkHashBeforeLoad: Boolean(options.checkHashBeforeLoad),
		versionName: options.versionName || getVersion(),
		retryTimeout: options.retryTimeout || 1000 * 60,
		emitTimeout: options.emitTimeout || 1000 * 60,
		mainPath: options.mainPath ? path.join(__dirname, '..', '..', '..', options.mainPath) : void 0,
		checkForUpdateOnConnect: options.checkForUpdateOnConnect === void 0
			? true
			: options.checkForUpdateOnConnect,
	}
}

export function timeout(ms: number, data?: {}): Promise<never> {
	return new Promise((_, reject) => setTimeout(() => reject({
		message: 'timeout',
		...data,
	}), ms))
}
