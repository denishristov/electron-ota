import tmp from 'tmp'
import crypto from 'crypto'
import fs from 'fs'
import util from 'util'

const randomBytes = util.promisify(crypto.randomBytes)
const write = util.promisify(fs.write)

export interface IRegisterCredentials {
	path: string
	key: string
	clean(): void
}

export interface IRegisterAdminService {
	genRegisterCredentials(): Promise<IRegisterCredentials>
}

@DI.injectable()
export default class RegisterAdminService implements IRegisterAdminService {
	public genRegisterCredentials(): Promise<IRegisterCredentials> {
		return new Promise((resolve, reject) => {
			tmp.dir((error, path, cleanDir) => {
				error && reject(error)

				tmp.file(
					{ dir: path, mode: 0o400, prefix: 'register-key' },
					async (error, path, fd, cleanFile) => {
					error && reject(error)

					const key = await this.genRegisterKey()
					await write(fd, key)

					resolve({
						path,
						key,
						clean() {
							cleanFile()
							cleanDir()
						},
					})
				})
			})
		})
	}

	private async genRegisterKey() {
		const bytes = await randomBytes(1024)
		return bytes.toString('base64')
	}
}
