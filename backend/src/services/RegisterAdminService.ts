import tmp from 'tmp'
import crypto from 'crypto'
import fs from 'fs'
import util from 'util'
import {
	IRegisterKeyPathResponse,
	IRegisterAdminRequest,
	IRegisterAdminResponse,
} from 'shared'
import { IAdminsService } from './AdminsService'

const randomBytes = util.promisify(crypto.randomBytes)
const write = util.promisify(fs.write)

export interface IRegisterCredentials {
	path: string
	key: string
	clean(): void
}

export interface IRegisterAdminService {
	getCredentialsKeyPath(): Promise<IRegisterKeyPathResponse>
	register(user: IRegisterAdminRequest): Promise<IRegisterAdminResponse>
}

@DI.injectable()
export default class RegisterAdminService implements IRegisterAdminService {
	private static readonly REGISTER_TIMEOUT = 1000 * 60 * 15
	private readonly registerCredentials = new Map<string, IRegisterCredentials>()
	private readonly timeouts = new Map<string, NodeJS.Timeout>()

	constructor(@DI.inject(DI.Services.User) private readonly adminsService: IAdminsService) {}

	@bind
	public async getCredentialsKeyPath(): Promise<IRegisterKeyPathResponse> {
		const credentials = await this.genRegisterCredentials()
		const { key, path } = credentials

		this.registerCredentials.set(key, credentials)

		return { path }
	}

	@bind
	public async register({ key, ...admin }: IRegisterAdminRequest): Promise<IRegisterAdminResponse> {
		if (this.registerCredentials.has(key)) {
			this.registerCredentials.get(key).clean()
			clearTimeout(this.timeouts.get(key))

			return await this.adminsService.addAdmin(admin)
		}

		return {
			isSuccessful: false,
		}
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

					const credentials = {
						path,
						key,
						clean: () => {
							if (this.registerCredentials.has(key)) {
								this.registerCredentials.delete(key)
								cleanFile()
								cleanDir()
							}
						},
					}

					this.timeouts.set(key, setTimeout(credentials.clean, RegisterAdminService.REGISTER_TIMEOUT))
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
