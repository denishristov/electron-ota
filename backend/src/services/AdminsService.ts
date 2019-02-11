import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { Admin } from '../models/Admin'
import { PASS_SECRET_KEY } from '../config'
import { IRegisterCredentialsService } from './RegisterCredentialsService'
import { InstanceType, ModelType } from 'typegoose'

import {
	AuthenticatedRequest,
	AdminAuthenticationResponse,
	AdminLoginRequest,
	AdminLoginResponse,
	RegisterAdminRequest,
	RegisterAdminResponse,
	AdminEditProfileRequest,
	GetProfileResponse,
} from 'shared'
import { filterBoolean } from '../util/functions'

export interface IAdminsService {
	login(req: AdminLoginRequest): Promise<AdminLoginResponse>
	logout(req: AuthenticatedRequest): Promise<void>
	authenticate(req: AuthenticatedRequest): Promise<AdminAuthenticationResponse>
	register(req: RegisterAdminRequest): Promise<RegisterAdminResponse>
	getProfile(req: AuthenticatedRequest): Promise<GetProfileResponse>
	editProfile(req: AdminEditProfileRequest): Promise<void>
	deleteProfile(req: AuthenticatedRequest): Promise<void>
}

interface IJWTPayload {
	id: string
}

@DI.injectable()
export default class AdminsService implements IAdminsService {
	constructor(
		@DI.inject(DI.Models.Admin)
		private readonly AdminModel: ModelType<Admin>,
		@DI.inject(DI.Services.RegisterCredentials)
		private readonly credentialsService: IRegisterCredentialsService,
	) {}

	@bind
	public async login({ email, name, password }: AdminLoginRequest): Promise<AdminLoginResponse> {
		try {
			if (!email && !name) {
				throw new Error('No email or name')
			}

			const user = await this.AdminModel
				.findOne(filterBoolean({ email, name }))
				.select('password authTokens')

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
	public async logout({ authToken }: AuthenticatedRequest): Promise<void> {
		const { id } =  await this.getPayloadFromToken(authToken)

		const hashed = this.hashAuthToken(authToken)

		await this.AdminModel.findByIdAndUpdate(id, { $pull: { authTokens: hashed } })
	}

	@bind
	public async authenticate({ authToken }: AuthenticatedRequest): Promise<AdminAuthenticationResponse> {
		try {
			const { id } =  await this.getPayloadFromToken(authToken)

			const { authTokens } = await this.AdminModel.findById(id).select('authTokens')

			if (!authTokens) {
				throw new Error('Invalid token')
			}

			const hashedToken = await this.hashAuthToken(authToken)

			return {
				isAuthenticated: Boolean(authTokens.find((token) => token === hashedToken)),
			}
		} catch (error) {
			return {
				isAuthenticated: false,
			}
		}
	}

	@bind
	public async register({ name, email, password, key }: RegisterAdminRequest): Promise<RegisterAdminResponse> {
		if (!this.credentialsService.verify(key)) {
			return {
				isSuccessful: false,
			}
		}

		const { AdminModel } = this

		const admin = new AdminModel({
			name,
			email,
			password: await this.hashPassword(password),
		})

		return {
			isSuccessful: true,
			authToken: await this.generateTokenAndAddToAdmin(admin),
		}
	}

	@bind
	public async editProfile({
		authToken,
		name,
		email,
		pictureUrl,
		newPassword,
		oldPassword,
	}: AdminEditProfileRequest) {
		const { id } = await this.getPayloadFromToken(authToken)

		const user = await this.AdminModel.findByIdAndUpdate(id, filterBoolean({
			name,
			email,
			pictureUrl,
		}))

		if (oldPassword && newPassword) {
			if (!await bcrypt.compare(oldPassword, user.password)) {
				throw new Error('Invalid password')
			}

			user.authTokens = []
			user.password = await this.hashPassword(newPassword)

			await user.save()
		}
	}

	@bind
	public async deleteProfile({ authToken }: AuthenticatedRequest) {
		const { id } = await this.getPayloadFromToken(authToken)

		await this.AdminModel.findByIdAndDelete(id)
	}

	@bind
	public async getProfile({ authToken }: AuthenticatedRequest) {
		const { id } = await this.getPayloadFromToken(authToken)

		const { name, pictureUrl, email } = await this.AdminModel.findById(id).select('name pictureUrl email')

		return { name, pictureUrl, email }
	}

	private async generateTokenAndAddToAdmin(admin: InstanceType<Admin>): Promise<string> {
		const token = await this.generateToken(admin.id)

		const hashed = this.hashAuthToken(token)

		admin.authTokens.push(hashed)
		await admin.save()

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

	private getPayloadFromToken(authToken: string): Promise<IJWTPayload> {
		return jwt.verify(authToken, PASS_SECRET_KEY, { algorithms: ['HS256'] }) as Promise<IJWTPayload>
	}
}
