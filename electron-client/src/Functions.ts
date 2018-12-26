import fs from 'fs'
import _download from 'download'

export function noop() {}

function writeFile(path: string, data: any): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, data, (error) => {
			if (error) {
				reject(error)
			}

			resolve()
		})
	})
}

export async function download(url: string, filePath: string): Promise<void> {
	await writeFile(filePath, await _download(url))
}
