import bcrypt from 'bcrypt-nodejs'
import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import jwt from 'jsonwebtoken'
import { Model } from 'mongoose'
import {
	IUserAuthenticationRequest,
	IUserAuthenticationResponse,
	IUserLoginRequest,
	IUserLoginResponse,
} from 'shared'
import { Models } from '../dependencies/symbols'
import { IUserDocument } from '../models/User'
import { AUTH_PRIVATE_KEY, AUTH_PUBLIC_KEY, AUTH_TOKEN_SALT } from '../util/env'

export interface IUserService {
	handleLogin(
		userLoginRequest: IUserLoginRequest,
	): Promise<IUserLoginResponse>

	handleAuthentication(
		userAuthenticationRequest: IUserAuthenticationRequest,
	): Promise<IUserAuthenticationResponse>
}

@injectable()
export default class UserService {
	constructor(
		@inject(Models.User) private readonly userModel: Model<IUserDocument>,
	) {}

	@bind
	public async handleLogin({ email, password }: IUserLoginRequest): Promise<IUserLoginResponse> {
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
	public async handleAuthentication({ authToken }: IUserAuthenticationRequest): Promise<IUserAuthenticationResponse> {
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

	@bind
	private generateToken(userId: string, expiresIn: string = '30d'): string {
		return jwt.sign({ id: userId }, AUTH_PRIVATE_KEY, { expiresIn, algorithm: 'RS256' })
	}

	@bind
	private doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, hashedPassword, (error, isMatch: boolean) => {
				error && reject(error)
				resolve(isMatch)
			})
		})
	}

	@bind
	private hashAuthToken(authToken: string): Promise<string> {
		return new Promise((resolve, reject) => {
			bcrypt.hash(authToken, AUTH_TOKEN_SALT, void 0, (error, result) => {
				error && reject(error)
				resolve(result)
			})
		})
	}

	private async register(user: { name: string, password: string, email: string }) {
		this.userModel.create({ ... user, password: await this.hashPassword(user.password) })
	}

	private hashPassword(password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			bcrypt.genSalt(10, (error, salt) => {
				error && reject(error)

				bcrypt.hash(password, salt, void 0, (error: Error, hash) => {
					error && reject(error)
					resolve(hash)
				})
			})
		})
	}
}
