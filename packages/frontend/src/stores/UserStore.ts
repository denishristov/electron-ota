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
	RegisterAdminRequest,
	RegisterAdminResponse,
 } from 'shared'
import { filterValues, memoize } from '../util/functions'
import ValidationHook from '../util/ValidationHook'

export interface IUserStore {
	profile: IProfile
	isLoading: boolean
	isAuthenticated: boolean | null
	login(req: AdminLoginRequest): Promise<boolean>
	logout(): void
	register(request: RegisterAdminRequest): Promise<boolean>
	deleteProfile(): Promise<void>
	editProfile(request: AdminEditProfileRequest): Promise<void>
}

interface IProfile {
	name: string
	email: string
	pictureUrl: string
}

@injectable()
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
		@inject(nameof<IApi>())
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
		this.api.fetch({ eventType: EventType.Logout })

		this.isAuthenticated = null
		this.authToken = null

		Cookies.remove('authToken')
	}

	@action
	public async register(request: RegisterAdminRequest) {
		const { isSuccessful, authToken } = await this.api.fetch({
			eventType: EventType.RegisterAdmin,
			request,
			requestType: RegisterAdminRequest,
			responseType: RegisterAdminResponse,
		})

		if (authToken) {
			this.setAuthToken(authToken)
			this.fetchProfile()
		}

		return isSuccessful
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
				this.fetchProfile()
			}
		}
	}

	@memoize
	@action
	private async fetchProfile() {
		const profile = await this.api.fetch({
			eventType: EventType.GetProfile,
			responseType: AdminPublicModel,
		})

		Object.assign(this.profile, profile)
	}

	@bind
	private getAuthToken(data: object) {
		return this.authToken
			? Object.assign(data, { authToken: this.authToken })
			: data
	}

	private setAuthToken(authToken: string) {
		this.authToken = authToken
		this.isAuthenticated = true
		Cookies.set('authToken', authToken)
	}
}

export default UserStore
