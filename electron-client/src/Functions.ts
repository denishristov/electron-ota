import fs from 'fs'
import util from 'util'
import crypto from 'crypto'
import io from 'socket.io-client'

const exists = util.promisify(fs.exists)
const mkdir = util.promisify(fs.mkdir)

export const readdir = util.promisify(fs.readdir)
export const unlink = util.promisify(fs.unlink)

export function hashFile(path: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash('sha256')
		const rs = fs.createReadStream(path)

		rs.on('error', reject)
		rs.on('data', chunk => hash.update(chunk))
		rs.on('end', () => resolve(hash.digest('base64')))
	})
}

export function hashFileSync(path: string): string {
	const file = fs.readFileSync('path')
	const hash = crypto.createHash('sha256')
		.update(file)
		.digest('base64')

	return hash
}

export async function checkDir(path: string): Promise<void> {
	if (!await exists(path)) {
		await mkdir(path)
	}
}

export function uuid(): string {
	return crypto.randomBytes(32).toString('base64')
}

export async function connect(uri: string, query: string): Promise<SocketIOClient.Socket> {
	await Promise.resolve()
	return io(uri, { query })
}
