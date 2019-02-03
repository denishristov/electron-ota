import tmp from 'tmp'
import crypto from 'crypto'
import fs from 'fs'
import util from 'util'
import {
	RegisterKeyPathResponse,
} from 'shared'

const randomBytes = util.promisify(crypto.randomBytes)
const write = util.promisify(fs.write)

export interface IRegisterCredentials {
	path: string
	key: string
	timeout: NodeJS.Timeout
	clean(): void
}

export interface IRegisterCredentialsService {
	getCredentialsKeyPath(): Promise<RegisterKeyPathResponse>
	verify(key: string): boolean
}

@DI.injectable()
export default class RegisterCredentialsService implements IRegisterCredentialsService {
	private static readonly REGISTER_TIMEOUT = 1000 * 60 * 15
	private readonly registerCredentials = new Map<string, IRegisterCredentials>()

	@bind
	public async getCredentialsKeyPath(): Promise<RegisterKeyPathResponse> {
		const { path } = await this.genRegisterCredentials()

		return { path }
	}

	@bind
	public verify(key: string): boolean {
		if (this.registerCredentials.has(key)) {
			const { clean, timeout } = this.registerCredentials.get(key)

			clearTimeout(timeout)
			clean()

			return true
		}

		return false
	}

	private genRegisterCredentials(): Promise<IRegisterCredentials> {
		return new Promise((resolve, reject) => {
			tmp.dir((error, path, cleanDir) => {
				error && reject(error)

				tmp.file(
					{ dir: path, mode: 0o400 },
					async (error, path, fd, cleanFile) => {
					error && reject(error)

					const key = await this.genRegisterKey()
					await write(fd, key)

					const clean = () => {
						if (this.registerCredentials.has(key)) {
							this.registerCredentials.delete(key)
							cleanFile()
							cleanDir()
						}
					}

					const timeout = setTimeout(clean, RegisterCredentialsService.REGISTER_TIMEOUT)

					const credentials = {
						path,
						key,
						clean,
						timeout,
					}

					this.registerCredentials.set(key, credentials)
					resolve(credentials)
				})
			})
		})
	}

	private async genRegisterKey() {
		const bytes = await randomBytes(1024)
		return bytes.toString('base64')
	}
}
