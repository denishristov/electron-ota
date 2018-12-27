import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { Model } from 'mongoose'
import {
	IUserAuthenticationRequest,
	IUserAuthenticationResponse,
	IUserLoginRequest,
	IUserLoginResponse,
} from 'shared'
import { IUserDocument } from '../models/User'
import { PASS_SECRET_KEY } from '../config/config'

export interface IAdminsService {
	login(
		userLoginRequest: IUserLoginRequest,
	): Promise<IUserLoginResponse>

	authenticate(
		userAuthenticationRequest: IUserAuthenticationRequest,
	): Promise<IUserAuthenticationResponse>
}

@DI.injectable()
export default class AdminsService {
	constructor(
		@DI.inject(DI.Models.User) private readonly userModel: Model<IUserDocument>,
	) {}

	@bind
	public async login({ email, password }: IUserLoginRequest): Promise<IUserLoginResponse> {
		try {
			const user = await this.userModel.findOne({ email })

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

			const user = await this.userModel.findById(id)

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

	private async register(user: { name: string, password: string, email: string }) {
		this.userModel.create({ ... user, password: await this.hashPassword(user.password) })
	}

	private generateToken(userId: string, expiresIn: string = '30d'): string {
		return jwt.sign({ id: userId }, PASS_SECRET_KEY, { expiresIn, algorithm: 'HS256' })
	}

	private hashAuthToken(authToken: string): Promise<string> {
		return Promise.resolve().then(() => crypto.createHash('sha256').update(authToken).digest('base64'))
	}

	private async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, await bcrypt.genSalt(10))
	}

	private doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword)
	}
}
