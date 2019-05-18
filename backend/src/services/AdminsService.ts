import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { Admin } from '../models/Admin'
import { PASS_SECRET_KEY } from '../config'
import { IRegisterCredentialsService } from './RegisterCredentialsService'
import { InstanceType, ModelType } from 'typegoose'

import {
	AdminLoginRequest,
	AdminLoginResponse,
	RegisterAdminRequest,
	RegisterAdminResponse,
	AdminEditProfileRequest,
	AdminPublicModel,
} from 'shared'
import { filterValues } from '../util/functions'

export interface IAdminsService {
	login(req: AdminLoginRequest): Promise<AdminLoginResponse>
	logout(req: IAuthenticatedRequest): Promise<void>
	verify(authToken: string): Promise<IJWTPayload>
	register(req: RegisterAdminRequest): Promise<RegisterAdminResponse>
	getProfile(req: IAuthenticatedRequest): Promise<AdminPublicModel>
	getPublicProfile(id: string): Promise<AdminPublicModel>
	editProfile(req: AdminEditProfileRequest): Promise<void>
	deleteProfile(req: IAuthenticatedRequest): Promise<void>
	validatePassword(id: string, password: string): Promise<boolean>
}

interface IJWTPayload {
	id: string
}

export interface IAuthenticatedRequest {
	payload: IJWTPayload
	authToken: string
}

@injectable()
export default class AdminsService implements IAdminsService {
	constructor(
		@inject(nameof<Admin>())
		private readonly AdminModel: ModelType<Admin>,
		@inject(nameof<IRegisterCredentialsService>())
		private readonly credentialsService: IRegisterCredentialsService,
	) {}

	@bind
	public async login({ email, name, password }: AdminLoginRequest): Promise<AdminLoginResponse> {
		if (!email && !name) {
			throw new Error('No email or name')
		}

		const admin = await this.AdminModel
			.findOne(filterValues({ email, name }))
			.select('password authTokens')

		if (!admin || !await this.comparePasswords(password, admin.password)) {
			throw new Error('Invalid password')
		}

		return this.generateTokenAndAddToAdmin(admin)
	}

	@bind
	public async logout({ authToken, payload }: IAuthenticatedRequest): Promise<void> {
		const hashed = this.hashAuthToken(authToken)

		await this.AdminModel.findByIdAndUpdate(payload.id, { $pull: { authTokens: hashed } })
	}

	@bind
	public async verify(authToken: string): Promise<IJWTPayload> {
		const payload = await this.getPayloadFromToken(authToken)

		const hashedToken = await this.hashAuthToken(authToken)

		const [{ id }] = await this.AdminModel
			.find({
				_id: payload.id,
				authTokens: hashedToken,
			})
			.select('')

		if (!id) {
			throw new Error('Auth token is invalid.')
		}

		return payload
	}

	@bind
	public async register({ name, email, password, key }: RegisterAdminRequest): Promise<RegisterAdminResponse> {
		const [firstAdmin] = await this.AdminModel.find().limit(1)

		if (firstAdmin || !this.credentialsService.verify(key)) {
			throw new Error('Registration form has been closed.')
		}

		const { AdminModel } = this

		const admin = new AdminModel({
			name,
			email,
			password: await this.hashPassword(password),
		})

		return this.generateTokenAndAddToAdmin(admin)
	}

	@bind
	public async editProfile({
		payload: { id },
		authToken,
		name,
		email,
		pictureUrl,
		newPassword,
		oldPassword,
	}: AdminEditProfileRequest & IAuthenticatedRequest) {
		const user = await this.AdminModel.findByIdAndUpdate(id, filterValues({
			name,
			email,
			pictureUrl,
		}))

		if (oldPassword && newPassword) {
			if (!await this.comparePasswords(oldPassword, user.password)) {
				throw new Error('Invalid password')
			}

			user.authTokens = [authToken]
			user.password = await this.hashPassword(newPassword)

			await user.save()
		}
	}

	@bind
	public async deleteProfile({ payload: { id } }: IAuthenticatedRequest) {
		await this.AdminModel.findByIdAndDelete(id)
	}

	@bind
	public async getProfile({ payload: { id } }: IAuthenticatedRequest) {
		return await this.getPublicProfile(id)
	}

	public async validatePassword(id: string, password: string) {
		const { password: hashedPassword } = await this.AdminModel
			.findById(id)
			.select('password')

		return await this.comparePasswords(password, hashedPassword)
	}

	public async getPublicProfile(id: string) {
		const { name, pictureUrl, email } = await this.AdminModel.findById(id).select('name pictureUrl email')

		return { name, pictureUrl, email }
	}

	private getPayloadFromToken(authToken: string): Promise<IJWTPayload> {
		return jwt.verify(authToken, PASS_SECRET_KEY, { algorithms: ['HS256'] }) as Promise<IJWTPayload>
	}

	private comparePasswords(password: string, hashedPassword: string) {
		return bcrypt.compare(password, hashedPassword)
	}

	private async generateTokenAndAddToAdmin(admin: InstanceType<Admin>) {
		const authToken = await this.generateToken(admin.id)

		const hashed = this.hashAuthToken(authToken)

		admin.authTokens.push(hashed)
		await admin.save()

		return { authToken }
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
