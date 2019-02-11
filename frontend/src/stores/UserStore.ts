import Cookies from 'js-cookie'
import { action, computed, observable } from 'mobx'
import { IApi } from '../util/Api'
import {
	EventType,
	AdminAuthenticationResponse,
	AdminLoginResponse,
	GetProfileResponse,
	AdminLoginRequest,
 } from 'shared'

export interface IUserStore {
	profile: IProfile
	isLoading: boolean
	isAuthenticated: boolean | null
	login(req: AdminLoginRequest): Promise<boolean>
	logout(): void
	setAuthToken(authToken: string): void
}

interface IProfile {
	name: string
	email: string
	pictureUrl: string
}

@DI.injectable()
class UserStore implements IUserStore {
	@observable
	public isAuthenticated: boolean | null = null

	@observable
	public profile: IProfile = {
		name: '',
		email: '',
		pictureUrl: '',
	}

	private authToken: string | null = Cookies.get('authToken') || null

	constructor(
		@DI.inject(DI.Api)
		private readonly api: IApi,
	) {
		this.api.on(EventType.Connect, this.authenticate)
		this.api.usePreEmit(this.getAuthToken)
	}

	@computed
	public get isLoading(): boolean {
		return !this.profile.name && Boolean(this.authToken) && this.isAuthenticated === null
	}

	public setAuthToken(authToken: string) {
		this.authToken = authToken
		this.isAuthenticated = true
		Cookies.set('authToken', authToken)
	}

	@action.bound
	public async login(req: AdminLoginRequest): Promise<boolean> {
		const {
			authToken,
			isAuthenticated,
		} = await this.api.emit<AdminLoginResponse>(EventType.Login, req)

		if (isAuthenticated && authToken) {
			this.setAuthToken(authToken)

			const profile = await this.api.emit<GetProfileResponse>(EventType.GetProfile)
			Object.assign(this.profile, profile)

			return true
		}

		return false
	}

	@action.bound
	public logout() {
		this.isAuthenticated = null
		this.authToken = null

		Cookies.remove('authToken')

		this.api.emit(EventType.Logout)
	}

	@action.bound
	private async authenticate(): Promise<void> {
		if (this.authToken) {
			const {
				isAuthenticated,
			} = await this.api.emit<AdminAuthenticationResponse>(
				EventType.Authentication,
				{ authToken: this.authToken },
			)

			this.isAuthenticated = isAuthenticated

			if (isAuthenticated) {
				const profile = await this.api.emit<GetProfileResponse>(EventType.GetProfile)
				Object.assign(this.profile, profile)
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
