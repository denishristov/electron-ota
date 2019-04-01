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

	constructor(
		@inject(nameof<IApi>())
		private readonly api: IApi,
	) {
		this.authenticate()
	}

	@computed
	public get isLoading(): boolean {
		return !this.profile.name && this.isAuthenticated === null
	}

	@action.bound
	public async login(request: AdminLoginRequest) {
		await this.api.login(request)

		await this.authenticate()
	}

	@action.bound
	public logout() {
		this.api.fetch({ eventType: EventType.Logout })

		this.isAuthenticated = null
	}

	@action
	public async register(request: RegisterAdminRequest) {
		await this.api.register(request)

		await this.authenticate()
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
		await this.api.connect()

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
