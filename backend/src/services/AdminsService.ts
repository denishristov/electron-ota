import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { Model } from 'mongoose'
import {
	IUserAuthenticationRequest,
	IUserAuthenticationResponse,
	IUserLoginRequest,
	IUserLoginResponse,
	IRegisterKeyAuthRequest,
	IRegisterKeyPathResponse,
	IRegisterKeyAuthResponse,
	IRegisterAdminRequest,
	IRegisterAdminResponse,
} from 'shared'
import { IUserDocument } from '../models/User'
import { PASS_SECRET_KEY } from '../config/config'
import { IRegisterAdminService, IRegisterCredentials } from './RegisterAdminService'

export interface IAdminsService {
	login(req: IUserLoginRequest): Promise<IUserLoginResponse>
	authenticate(res: IUserAuthenticationRequest): Promise<IUserAuthenticationResponse>
	getCredentialsKeyPath(): Promise<IRegisterKeyPathResponse>
	verifyCredentialKey(req: IRegisterKeyAuthRequest): Promise<IRegisterKeyAuthResponse>
	register(user: IRegisterAdminRequest): Promise<IRegisterAdminResponse>
}

@DI.injectable()
export default class AdminsService implements IAdminsService {
	private static readonly REGISTER_TIMEOUT = 1000 * 60 * 10

	private readonly registerCredentials: Promise<IRegisterCredentials>
	private isRegisterAuthenticated = false

	constructor(
		@DI.inject(DI.Models.User)
		private readonly admins: Model<IUserDocument>,
		@DI.inject(DI.Services.RegisterAdmin)
		private readonly registerAdminService: IRegisterAdminService,
	) {
		this.registerCredentials = this.admins.find().then(async (admins) => {
			return await this.registerAdminService.genRegisterCredentials()
		})
	}

	@bind
	public async login({ email, password }: IUserLoginRequest): Promise<IUserLoginResponse> {
		try {
			const user = await this.admins.findOne({ email })

			if (!await this.doesPasswordMatch(password, user.password)) {
				throw new Error('Invalid password')
			}

			const authToken = this.generateToken(user.id)
			this.hashAuthToken(authToken).then((hashedToken) => {
				user.authTokens.push(hashedToken)
				user.save()
			})

			return {
				authToken,
				isAuthenticated: true,
			}
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.log(error)
			return {
				errorMessage: error.message,
				isAuthenticated: false,
			}
		}
	}

	@bind
	public async authenticate({ authToken }: IUserAuthenticationRequest): Promise<IUserAuthenticationResponse> {
		try {
			const { id } = jwt.verify(authToken, PASS_SECRET_KEY, { algorithms: ['HS256'] }) as { id: string }

			const user = await this.admins.findById(id)

			if (!user) {
				throw new Error('Invalid token')
			}

			const hashedToken = await this.hashAuthToken(authToken)

			return {
				isAuthenticated: Boolean(user.authTokens.find((token) => token === hashedToken)),
			}
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.log(error)
			return {
				errorMessage: error.message,
				isAuthenticated: false,
			}
		}
	}

	@bind
	public async getCredentialsKeyPath(): Promise<IRegisterKeyPathResponse> {
		const { path } = await this.registerCredentials

		if (!path) {
			return { errorMessage: 'Register form has been closed', path }
		}

		return { path }
	}

	@bind
	public async verifyCredentialKey({ key }: IRegisterKeyAuthRequest): Promise<IRegisterKeyAuthResponse> {
		const credentials = await this.registerCredentials

		if (key === credentials.key) {
			this.isRegisterAuthenticated = true

			setTimeout(() => {
				this.isRegisterAuthenticated = false
			}, AdminsService.REGISTER_TIMEOUT)

			return {
				isAuthenticated: true,
			}
		}

		return {
			isAuthenticated: false,
		}
	}

	@bind
	public async register(user: IRegisterAdminRequest): Promise<IRegisterAdminResponse> {
		if (this.isRegisterAuthenticated) {
			await this.admins.create({ ...user, password: await this.hashPassword(user.password) })

			const { clean } = await this.registerCredentials
			clean()

			return {
				isSuccessful: true,
			}
		}

		return {
			isSuccessful: false,
		}
	}

	private generateToken(userId: string, expiresIn: string = '30d'): string {
		return jwt.sign({ id: userId }, PASS_SECRET_KEY, { expiresIn, algorithm: 'HS256' })
	}

	private async hashAuthToken(authToken: string): Promise<string> {
		await Promise.resolve()
		return crypto.createHash('sha256').update(authToken).digest('base64')
	}

	private async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, await bcrypt.genSalt(10))
	}

	private doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword)
	}
}
