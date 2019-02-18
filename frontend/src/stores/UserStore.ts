import Cookies from 'js-cookie'
import { action, computed, observable } from 'mobx'
import { IApi } from '../services/Api'
import {
	EventType,
	AdminAuthenticationResponse,
	AdminLoginResponse,
	AdminPublicModel,
	AdminLoginRequest,
	AuthenticatedRequest,
	AdminEditProfileRequest,
 } from 'shared'
import { filterValues } from '../util/functions'
import ValidationHook from '../util/ValidationHook'

export interface IUserStore {
	profile: IProfile
	isLoading: boolean
	isAuthenticated: boolean | null
	login(req: AdminLoginRequest): Promise<boolean>
	logout(): void
	deleteProfile(): Promise<void>
	editProfile(request: AdminEditProfileRequest): Promise<void>
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
		@DI.inject(DI.Services.Api)
		private readonly api: IApi,
	) {
		this.api
			.on(EventType.Connect, this.authenticate)
			.pre(this.getAuthToken)
			.pre(new ValidationHook().handle)
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
	public async login(request: AdminLoginRequest): Promise<boolean> {
		const {
			authToken,
			isAuthenticated,
		} = await this.api.fetch({
			eventType: EventType.Login,
			request,
			requestType: AdminLoginRequest,
			responseType: AdminLoginResponse,
		})

		if (isAuthenticated && authToken) {
			this.setAuthToken(authToken)

			const profile = await this.api.fetch({
				eventType: EventType.GetProfile,
				responseType: AdminPublicModel,
			})

			Object.assign(this.profile, profile)

			return true
		}

		return false
	}

	@action.bound
	public logout() {
		this.isAuthenticated = null
		this.authToken = null

		this.api.fetch({ eventType: EventType.Logout })

		Cookies.remove('authToken')
	}

	@action.bound
	public async deleteProfile() {
		await this.api.fetch({ eventType: EventType.DeleteProfile })
		this.logout()
	}

	@action.bound
	public async editProfile(request: AdminEditProfileRequest) {
		const { name, email, pictureUrl } = request

		await this.api.fetch({
			eventType: EventType.EditProfile,
			request,
			requestType: AdminEditProfileRequest,
		})

		Object.assign(this.profile, filterValues({
			name,
			email,
			pictureUrl,
		}))
	}

	@action.bound
	private async authenticate(): Promise<void> {
		if (this.authToken) {
			const {
				isAuthenticated,
			} = await this.api.fetch({
				eventType: EventType.Authentication,
				request: { authToken: this.authToken },
				requestType: AuthenticatedRequest,
				responseType: AdminAuthenticationResponse,
			})

			this.isAuthenticated = isAuthenticated

			if (isAuthenticated) {
				const profile = await this.api.fetch({
					eventType: EventType.GetProfile,
					responseType: AdminPublicModel,
				})
				Object.assign(this.profile, profile)
			}
		}
	}

	@bind
	private getAuthToken(data: object) {
		return this.authToken
			? Object.assign(data, { authToken: this.authToken })
			: data
	}
}

export default UserStore
