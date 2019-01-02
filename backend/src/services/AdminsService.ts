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
	private static readonly REGISTER_TIMEOUT = 1000 * 60 * 15

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
	public async login({ email, name, password }: IUserLoginRequest): Promise<IUserLoginResponse> {
		try {
			const user = await this.admins.findOne({ email, name }).select('password')

			if (!await this.doesPasswordMatch(password, user.password)) {
				throw new Error('Invalid password')
			}

			return {
				authToken: await this.generateTokenAndAddToUser(user),
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

			const { authTokens } = await this.admins.findById(id).select('authTokens')

			if (!authTokens) {
				throw new Error('Invalid token')
			}

			const hashedToken = await this.hashAuthToken(authToken)

			return {
				isAuthenticated: Boolean(authTokens.find((token) => token === hashedToken)),
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
	public async register({ name, email, password }: IRegisterAdminRequest): Promise<IRegisterAdminResponse> {
		if (this.isRegisterAuthenticated) {
			const user = await this.admins.create({
				name,
				email,
				password: await this.hashPassword(password),
			})

			const { clean } = await this.registerCredentials
			clean()

			this.isRegisterAuthenticated = false

			return {
				isSuccessful: true,
				authToken: await this.generateTokenAndAddToUser(user),
			}
		}

		return {
			isSuccessful: false,
		}
	}

	private async generateTokenAndAddToUser(user: IUserDocument): Promise<string> {
		const token = await this.generateToken(user.id)

		this.hashAuthToken(token).then((hashed) => {
			user.authTokens.push(hashed)
			user.save()
		})

		return token
	}

	private generateToken(userId: string, expiresIn: string = '30d'): Promise<string> {
		return new Promise((resolve, reject) => {
			jwt.sign({ id: userId }, PASS_SECRET_KEY, { expiresIn, algorithm: 'HS256' }, (error, token) => {
				error && reject(error)
				resolve(token)
			})
		})
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
