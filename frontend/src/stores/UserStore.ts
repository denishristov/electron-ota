import { action, observable, computed } from 'mobx'
import bind from 'bind-decorator'
import { IUserLoginResponse, IUserAuthenticationResponse, IUserLoginRequest, EventTypes, IUserAuthenticationRequest } from 'shared'
import Cookies from 'js-cookie'
import { IApi } from '../util/Api'

export default class UserStore {
	private authToken: string | null = null

	@observable
	isAuthenticated: boolean = false

	constructor(private readonly api: IApi) {
		const authToken = Cookies.get('authToken')
		
		if (authToken) {
			this.authToken = authToken
			this.authenticate()
		}
	}

	@computed
	get isLoading(): boolean {
		return this.authToken 
			? !this.isAuthenticated
			: true
	}

	@action.bound
	async login(email: string, password: string): Promise<void> {
		const { 
			authToken,
			errorMessage, 
			isAuthenticated
		} = await this.api.emit
		<IUserLoginRequest, IUserLoginResponse>
		(EventTypes.Login, { email, password })

		errorMessage && console.warn(errorMessage)

		if (isAuthenticated) {
			if (authToken) {
				this.authToken = authToken
				Cookies.set(`authToken`, authToken)
			}

			this.isAuthenticated = true
			this.api.preEmit(this.getAuthToken)
		}
	}

	@action.bound
	private async authenticate(): Promise<void> {
		if (!this.authToken) {
			return
		}

		const { 
			errorMessage, 
			isAuthenticated 
		} = await this.api.emit
		<IUserAuthenticationRequest, IUserAuthenticationResponse>
		(EventTypes.Authentication, this.getAuthToken())

		errorMessage && console.warn(errorMessage)

		if (isAuthenticated) {
			this.isAuthenticated = true
			this.api.preEmit(this.getAuthToken)
		}
	}

	@bind
	private getAuthToken(): { authToken: string } {
		if (!this.authToken) {
			throw new Error('No auth token')
		}

		return { authToken: this.authToken }
	}
}