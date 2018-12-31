import fs from 'fs'
import util from 'util'
import crypto from 'crypto'

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

export async function checkDir(path: string): Promise<void> {
	if (!await exists(path)) {
		await mkdir(path)
	}
}
