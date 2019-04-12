import { action, computed, observable } from 'mobx'
import { IApi } from '../services/Api'
import {
	EventType,
	AdminPublicModel,
	AdminLoginRequest,
	AdminEditProfileRequest,
	RegisterAdminRequest,
 } from 'shared'
import { filterValues } from '../util/functions'

export interface IUserStore {
	profile: IProfile
	isLoading: boolean
	isAuthenticated: boolean | null
	login(req: AdminLoginRequest): Promise<void>
	logout(): void
	register(request: RegisterAdminRequest): Promise<void>
	deleteProfile(): Promise<void>
	editProfile(request: AdminEditProfileRequest): Promise<void>
	authenticate(): Promise<void>
}

interface IProfile {
	name: string
	email: string
	pictureUrl: string
}

const emptyProfile = {
	name: '',
	email: '',
	pictureUrl: '',
}

@injectable()
class UserStore implements IUserStore {
	@observable
	public isAuthenticated: boolean | null = null

	@observable
	public profile: IProfile = { ...emptyProfile }

	@observable
	private isFetching = false

	constructor(
		@inject(nameof<IApi>())
		private readonly api: IApi,
	) {}

	@computed
	public get isLoading(): boolean {
		return this.isFetching || this.isAuthenticated === null
	}

	@action.bound
	public async login(request: AdminLoginRequest) {
		try {
			this.isFetching = true
			await this.api.login(request)
			await this.authenticate()

		} finally {
			this.isFetching = false
		}
	}

	@action.bound
	public logout() {
		this.profile = { ...emptyProfile }
		this.isAuthenticated = null
		this.api.logout()
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
	public async authenticate(): Promise<void> {
		try {
			await this.api.connect()

			this.isAuthenticated = true

			const profile = await this.api.fetch({
				eventType: EventType.GetProfile,
				responseType: AdminPublicModel,
			})

			Object.assign(this.profile, profile)
		} catch {
			this.isAuthenticated = false
		}
	}
}

export default UserStore
