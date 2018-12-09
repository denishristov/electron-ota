import { action, observable } from 'mobx'
import UserAPI from './UserAPI'
import bind from 'bind-decorator'
import { IUserLoginResponse, IUserAuthenticationResponse } from 'shared'
import Cookies from 'js-cookie'

export default class UserStore {
	private readonly userAPI: UserAPI

	private authToken: string | null = null

	@observable
	private isLoggedIn: boolean = false

	constructor(userAPI: UserAPI) {
		this.userAPI = userAPI

		const authToken = Cookies.get('authToken')
		if (authToken) {
			console.log(authToken);
			this.authToken = authToken
			this.authenticate()
		}

		this.userAPI.onLogin(this.handleLoginResponse)
		this.userAPI.onAuthentication(this.handleAuthenticationResponse)
	}

	@bind
	login(email: string, password: string): void {
		this.userAPI.login(email, password)
	}

	@bind
	authenticate(): void {
		if (this.authToken) {
			this.userAPI.authenticate(this.authToken)
		}
	}

	@action.bound
	handleLoginResponse({ authToken, errorMessage, isAuthenticated }: IUserLoginResponse) {
		errorMessage && console.warn(errorMessage)

		if (isAuthenticated) {
			if (authToken) {
				this.authToken = authToken
				Cookies.set(`authToken`, authToken)
			}

			this.isLoggedIn = true
		}
	}

	@action.bound
	handleAuthenticationResponse({ errorMessage, isAuthenticated }: IUserAuthenticationResponse) {
		errorMessage && console.warn(errorMessage)
		console.log(isAuthenticated, `au`)

		if (isAuthenticated) {
			this.isLoggedIn = true
		}
	}
}