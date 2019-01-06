import Cookies from 'js-cookie'
import { action, computed, observable } from 'mobx'
import { EventType, IUserAuthenticationResponse, IUserLoginResponse } from 'shared'
import { IApi } from '../util/Api'
import { IUserLoginRequest } from '../../../shared/dist/interfaces/requests/UserLogin';

export interface IUserStore {
	isLoading: boolean
	isAuthenticated: boolean
	login(req: IUserLoginRequest): Promise<boolean>
	setAuthToken(authToken: string): void
}

@DI.injectable()
class UserStore implements IUserStore {
	@observable
	public isAuthenticated = false

	private authToken?: string = Cookies.get('authToken')

	constructor(@DI.inject(DI.Api) private readonly api: IApi) {
		this.api.on(EventType.Connect, this.authenticate)
		this.api.usePreEmit(this.getAuthToken)
	}

	@computed
	get isLoading(): boolean {
		return this.isAuthenticated ? false : Boolean(this.authToken)
	}

	public setAuthToken(authToken: string) {
		this.authToken = authToken
		this.isAuthenticated = true
		Cookies.set('authToken', authToken)
	}

	@action.bound
	public async login(req: IUserLoginRequest): Promise<boolean> {
		const {
			authToken,
			errorMessage,
			isAuthenticated,
		} = await this.api.emit<IUserLoginResponse>(EventType.Login, req)

		// tslint:disable-next-line:no-console
		errorMessage && console.warn(errorMessage)

		if (isAuthenticated && authToken) {
			this.setAuthToken(authToken)
			return true
		}

		return false
	}

	@action.bound
	private async authenticate(): Promise<void> {
		if (this.authToken) {
			const {
				errorMessage,
				isAuthenticated,
			} = await this.api.emit<IUserAuthenticationResponse>(
				EventType.Authentication,
				{ authToken: this.authToken },
			)

			// tslint:disable-next-line:no-console
			errorMessage && console.warn(errorMessage)

			if (isAuthenticated) {
				this.isAuthenticated = true
			}
		}
	}

	@bind
	private getAuthToken(): { authToken: string } | void {
		if (this.authToken) {
			return { authToken: this.authToken }
		}
	}
}

export default UserStore
