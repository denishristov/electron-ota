import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
import { Model } from 'mongoose'
import {
	IUserAuthenticationRequest,
	IUserAuthenticationResponse,
	IUserLoginRequest,
	IUserLoginResponse,
} from 'shared'
import { IUserDocument } from '../models/User'
import { AUTH_PRIVATE_KEY, AUTH_PUBLIC_KEY, AUTH_TOKEN_SALT } from '../util/env'

export interface IUserService {
	login(
		userLoginRequest: IUserLoginRequest,
	): Promise<IUserLoginResponse>

	authenticate(
		userAuthenticationRequest: IUserAuthenticationRequest,
	): Promise<IUserAuthenticationResponse>
}

@DI.injectable()
export default class UserService {
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

			const authToken = this.generateToken(user._id)
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
			const { id } = jwt.verify(authToken, AUTH_PUBLIC_KEY, { algorithms: ['RS256'] }) as { id: string }

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

	private generateToken(userId: string, expiresIn: string = '30d'): string {
		return jwt.sign({ id: userId }, AUTH_PRIVATE_KEY, { expiresIn, algorithm: 'RS256' })
	}

	private doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword)
	}

	private hashAuthToken(authToken: string): Promise<string> {
		return bcrypt.hash(authToken, AUTH_TOKEN_SALT)
	}

	private async register(user: { name: string, password: string, email: string }) {
		this.userModel.create({ ... user, password: await this.hashPassword(user.password) })
	}

	private async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(10)

		return bcrypt.hash(password, salt)
	}
}
