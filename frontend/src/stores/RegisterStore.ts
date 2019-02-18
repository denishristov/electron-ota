import { observable, computed } from 'mobx'
import { IApi } from '../services/Api'

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
		@DI.inject(DI.Services.Api)
		private readonly api: IApi,
		@DI.inject(DI.Stores.User)
		private readonly userStore: IUserStore,
	) {}

	@computed
	public get isLoading() {
		return !this.path
	}

	public async registerAdmin(request: RegisterAdminRequest) {
		const { isSuccessful, authToken } = await this.api.fetch({
			eventType: EventType.RegisterAdmin,
			request,
			requestType: RegisterAdminRequest,
			responseType: RegisterAdminResponse,
		})

		if (authToken) {
			this.userStore.setAuthToken(authToken)
		}

		return isSuccessful
	}

	public async fetchKeyPath() {
		const { path } = await this.api.fetch({
			eventType: EventType.GetRegisterKeyPath,
			responseType: RegisterKeyPathResponse,
		})

		this.path = path
	}
}
