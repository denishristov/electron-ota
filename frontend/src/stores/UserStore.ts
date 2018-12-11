import { action, observable, computed } from 'mobx'
import bind from 'bind-decorator'
import { IUserLoginResponse, IUserAuthenticationResponse, IUserLoginRequest, EventTypes, IUserAuthenticationRequest, DefaultEventTypes } from 'shared'
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
			this.api.preEmit(this.getAuthToken)

			this.api.on(DefaultEventTypes.Connect, this.authenticate)
		}
	}

	@computed
	get isLoading(): boolean {
		return this.authToken 
			? !this.isAuthenticated
			: false
	}

	@action.bound
	async login(email: string, password: string): Promise<void> {
		console.log('ss')
		const { 
			authToken,
			errorMessage, 
			isAuthenticated
		} = await this.api.emit<IUserLoginRequest, IUserLoginResponse>(EventTypes.Login, { email, password })
		console.log('sffsfgs')

		errorMessage && console.warn(errorMessage)
		
		if (isAuthenticated) {
			if (authToken) {
				this.authToken = authToken
				Cookies.set(`authToken`, authToken)
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
			isAuthenticated 
		} = await this.api.emit<IUserAuthenticationRequest, IUserAuthenticationResponse>(EventTypes.Authentication, this.getAuthToken())
			
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

		return { authToken: this.authToken }
	}
}