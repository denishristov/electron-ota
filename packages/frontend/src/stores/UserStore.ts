import Cookies from 'js-cookie'
import { action, computed, observable } from 'mobx'
import { IApi } from '../services/Api'
import {
	EventType,
	AdminPublicModel,
	AdminLoginRequest,
	AdminEditProfileRequest,
	RegisterAdminRequest,
 } from 'shared'
import { filterValues, memoize } from '../util/functions'

export interface IUserStore {
	profile: IProfile
	isLoading: boolean
	isAuthenticated: boolean | null
	login(req: AdminLoginRequest): Promise<void>
	logout(): void
	register(request: RegisterAdminRequest): Promise<void>
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

	private authToken?: string | null = null

	constructor(
		@inject(nameof<IApi>())
		private readonly api: IApi,
	) {
		const authToken = Cookies.get('authToken')

		if (authToken) {
			this.authenticate(authToken)
		}
	}

	@computed
	public get isLoading(): boolean {
		return !this.profile.name && Boolean(this.authToken) && this.isAuthenticated === null
	}

	@action.bound
	public async login(request: AdminLoginRequest) {
		const { authToken } = await this.api.login(request)

		await this.authenticate(authToken)
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
		const { authToken } = await this.api.register(request)

		await this.authenticate(authToken)
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
	private async authenticate(authToken: string): Promise<void> {
		await this.api.connect({ authToken })

		Cookies.set('authToken', authToken)

		this.authToken = authToken
		this.isAuthenticated = true

		this.fetchProfile()
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
}

export default UserStore
