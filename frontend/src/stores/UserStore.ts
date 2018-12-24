import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import Cookies from 'js-cookie'
import { action, computed, observable } from 'mobx'
import { EventType, IUserAuthenticationResponse, IUserLoginResponse } from 'shared'
import { IApi } from '../util/Api'
import * as DI from '../dependencies/symbols'

export interface IUserStore {
	isAuthenticated: boolean
	isLoading: boolean
	login(email: string, password: string): Promise<void>
}

@injectable()
class UserStore {
	@computed
	get isLoading(): boolean {
		return this.authToken
			? !this.isAuthenticated
			: false
	}

	@observable
	public isAuthenticated: boolean = false

	private authToken: string | null = null

	constructor(@inject(DI.Api) private readonly api: IApi) {
		const authToken = Cookies.get('authToken')

		if (authToken) {
			this.authToken = authToken
			this.api.preEmit(this.getAuthToken)

			this.api.on(EventType.Connect, this.authenticate)
		}
	}

	@action.bound
	public async login(email: string, password: string): Promise<void> {
		const {
			authToken,
			errorMessage,
			isAuthenticated,
		} = await this.api.emit<IUserLoginResponse>(EventType.Login, { email, password })

		// tslint:disable-next-line:no-console
		errorMessage && console.warn(errorMessage)

		if (isAuthenticated) {
			if (authToken) {
				this.authToken = authToken
				Cookies.set('authToken', authToken)
			}

			this.isAuthenticated = true
		}
	}

	@action.bound
	private async authenticate(): Promise<void> {
		if (!this.authToken) {
			return
		}

		const {
			errorMessage,
			isAuthenticated,
		} = await this.api.emit<IUserAuthenticationResponse>(
			EventType.Authentication,
			this.getAuthToken(),
		)

		// tslint:disable-next-line:no-console
		errorMessage && console.warn(errorMessage)

		if (isAuthenticated) {
			this.isAuthenticated = true
		}
	}

	@bind
	private getAuthToken(): { authToken: string } {
		if (!this.authToken) {
			throw new Error('No auth token')
		}

		console.log('tumor ->', this.authToken)

		return { authToken: this.authToken }
	}
}

export default UserStore
