import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { Model } from 'mongoose'
import { IAdminDocument } from '../models/Admin'
import { PASS_SECRET_KEY } from '../config/config'
import { IRegisterCredentialsService } from './RegisterCredentialsService'
import {
	AdminAuthenticationRequest,
	AdminAuthenticationResponse,
	AdminLoginRequest,
	AdminLoginResponse,
	RegisterAdminRequest,
	RegisterAdminResponse,
} from 'shared'

export interface IAdminsService {
	login(req: AdminLoginRequest): Promise<AdminLoginResponse>
	authenticate(req: AdminAuthenticationRequest): Promise<AdminAuthenticationResponse>
	register(req: RegisterAdminRequest): Promise<RegisterAdminResponse>
}

@DI.injectable()
export default class AdminsService implements IAdminsService {
	constructor(
		@DI.inject(DI.Models.Admin)
		private readonly admins: Model<IAdminDocument>,
		@DI.inject(DI.Services.RegisterCredentials)
		private readonly credentialsService: IRegisterCredentialsService,
	) {}

	@bind
	public async login({ email, name, password }: AdminLoginRequest): Promise<AdminLoginResponse> {
		try {
			const params = email ? { email } : name ? { name } : null

			if (!params) {
				throw new Error('No email or name')
			}

			const user = await this.admins.findOne(params).select('password authTokens')

			if (!await bcrypt.compare(password, user.password)) {
				throw new Error('Invalid password')
			}

			return {
				authToken: await this.generateTokenAndAddToAdmin(user),
				isAuthenticated: true,
			}
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.log(error)
			return {
				// errorMessage: error.message,
				isAuthenticated: false,
			}
		}
	}

	@bind
	public async authenticate({ authToken }: AdminAuthenticationRequest): Promise<AdminAuthenticationResponse> {
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
				// errorMessage: error.message,
				isAuthenticated: false,
			}
		}
	}

	@bind
	public async register({ name, email, password, key }: RegisterAdminRequest): Promise<RegisterAdminResponse> {
		if (!await this.credentialsService.verify(key)) {
			return {
				isSuccessful: false,
			}
		}

		const admin = await this.admins.create({
			name,
			email,
			password: await this.hashPassword(password),
		})

		return {
			isSuccessful: true,
			authToken: await this.generateTokenAndAddToAdmin(admin),
		}
	}

	private async generateTokenAndAddToAdmin(user: IAdminDocument): Promise<string> {
		const token = await this.generateToken(user.id)

		const hashed = this.hashAuthToken(token)

		user.authTokens.push(hashed)
		await user.save()

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

	private hashAuthToken(authToken: string): string {
		return crypto.createHash('sha256').update(authToken).digest('base64')
	}

	private async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, await bcrypt.genSalt(10))
	}
}
