import { observable, computed } from 'mobx'
import { IApi } from '../util/Api'

import { IUserStore } from './UserStore'
import {
	EventType,
	RegisterAdminRequest,
	RegisterAdminResponse,
	RegisterKeyPathResponse,
} from 'shared'

export interface IRegisterStore {
	path?: string
	isLoading: boolean
	registerAdmin(req: RegisterAdminRequest): Promise<boolean>
	fetchKeyPath(): Promise<void>
}

@DI.injectable()
export default class RegisterStore implements IRegisterStore {
	@observable
	public path?: string

	constructor(
		@DI.inject(DI.Api)
		private readonly api: IApi,
		@DI.inject(DI.Stores.User)
		private readonly userStore: IUserStore,
	) {}

	@computed
	public get isLoading() {
		return !this.path
	}

	public async registerAdmin(req: RegisterAdminRequest) {
		const { isSuccessful, authToken } = await this.api.emit<RegisterAdminResponse>(EventType.RegisterAdmin, req)

		if (authToken) {
			this.userStore.setAuthToken(authToken)
		}

		return isSuccessful
	}

	public async fetchKeyPath() {
		const { path } = await this.api.emit<RegisterKeyPathResponse>(EventType.GetRegisterKeyPath)
		this.path = path
	}
}
