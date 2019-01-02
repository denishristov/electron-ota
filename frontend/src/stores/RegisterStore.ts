import { observable, computed } from 'mobx'
import { IApi } from '../util/Api'
import UserStore from './UserStore';
import { IUserStore } from './UserStore';
import {
	EventType,
	IRegisterKeyAuthResponse,
	IRegisterAdminRequest,
	IRegisterAdminResponse,
	IRegisterKeyPathResponse,
} from 'shared'

export interface IRegisterStore {
	isAuthenticated: boolean
	path?: string
	isLoading: boolean
	authenticateRegisterAdmin(key: string): Promise<void>
	registerAdmin(req: IRegisterAdminRequest): Promise<boolean>
	fetchKeyPath(): Promise<void>
}

@DI.injectable()
export default class RegisterStore implements IRegisterStore {
	@observable
	public isAuthenticated = false

	@observable
	public path?: string

	constructor(
		@DI.inject(DI.Api) 
		private readonly api: IApi,
		@DI.inject(DI.Stores.User)
		private readonly userStore: IUserStore
	) {}

	@computed
	public get isLoading() {
		return !this.path
	}

	public async authenticateRegisterAdmin(key: string) {
		const { isAuthenticated } = await this.api.emit<IRegisterKeyAuthResponse>(EventType.RegisterKeyAuth, { key })

		this.isAuthenticated = isAuthenticated
	}

	public async registerAdmin(req: IRegisterAdminRequest) {
		const { isSuccessful, authToken } = await this.api.emit<IRegisterAdminResponse>(EventType.Register, req)

		if (authToken) {
			this.userStore.authToken = authToken
		}

		return isSuccessful
	}

	public async fetchKeyPath() {
		const { path } = await this.api.emit<IRegisterKeyPathResponse>(EventType.RegisterKeyPath)
		this.path = path
	}
}
