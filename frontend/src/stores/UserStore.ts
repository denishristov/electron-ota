import Cookies from 'js-cookie'
import { action, computed, observable } from 'mobx'
import { EventType, IUserAuthenticationResponse, IUserLoginResponse } from 'shared'
import { IApi } from '../util/Api'
import { IUserLoginRequest } from '../../../shared/dist/interfaces/requests/UserLogin';

export interface IUserStore {
	isAuthenticated: boolean
	isLoading: boolean
	authToken: string
	login(req: IUserLoginRequest): Promise<void>
}

@DI.injectable()
class UserStore implements IUserStore {
	@computed
	get isLoading(): boolean {
		return this.isAuthenticated ? false : Boolean(this._authToken)
	}

	@observable
	private _isAuthenticated = false

	private _authToken?: string

	constructor(@DI.inject(DI.Api) private readonly api: IApi) {
		this.api.on(EventType.Authentication, this.authenticate)
	}

	@computed
	public get isAuthenticated() {
		return this._isAuthenticated
	}

	public set isAuthenticated(value: boolean) {
		this._isAuthenticated = value

		if (value) {
			this.api.usePreEmit(this.getAuthToken)
		}
	}

	public set authToken(authToken: string) {
		this._authToken = authToken
		this.isAuthenticated = true
		Cookies.set('authToken', authToken)
	}

	@action.bound
	public async login(req: IUserLoginRequest): Promise<void> {
		const {
			authToken,
			errorMessage,
			isAuthenticated,
		} = await this.api.emit<IUserLoginResponse>(EventType.Login, req)

		// tslint:disable-next-line:no-console
		errorMessage && console.warn(errorMessage)

		if (isAuthenticated && authToken) {
			this.authToken = authToken
		}
	}

	@action.bound
	private async authenticate(): Promise<void> {
		this._authToken = Cookies.get('authToken')

		if (this._authToken) {
			const {
				errorMessage,
				isAuthenticated,
			} = await this.api.emit<IUserAuthenticationResponse>(
				EventType.Authentication,
				{ authToken: this._authToken },
			)

			// tslint:disable-next-line:no-console
			errorMessage && console.warn(errorMessage)

			if (isAuthenticated) {
				this.isAuthenticated = true
			}
		}
	}

	@bind
	private getAuthToken(): { authToken: string } {
		return { authToken: this._authToken! }
	}
}

export default UserStore
