import fs from 'fs'
import util from 'util'
import _download from 'download'

export const exists = util.promisify(fs.exists)
export const mkdir = util.promisify(fs.mkdir)
export const readFile = util.promisify(fs.readFile)
export const writeFile = util.promisify(fs.writeFile)

export async function download(url: string, filePath: string): Promise<void> {
	await writeFile(filePath, await _download(url))
}
