import { IAppsStore } from './AppsStore'
import { IUserStore } from './UserStore'
import { IRegisterStore } from './RegisterStore'

export interface IRootStore {
	userStore: IUserStore
	appsStore: IAppsStore
	registerStore: IRegisterStore
}

export function injectUserStore({ userStore }: IRootStore): { userStore: IUserStore } {
	return { userStore }
}

export function injectAppsStore({ appsStore }: IRootStore): { appsStore: IAppsStore } {
	return { appsStore }
}

export function injectRegisterStore({ registerStore }: IRootStore): { registerStore: IRegisterStore } {
	return { registerStore }
}

@DI.injectable()
class RootStore implements IRootStore {
	constructor(
		@DI.inject(DI.Stores.Apps)
		public appsStore: IAppsStore,
		@DI.inject(DI.Stores.User)
		public userStore: IUserStore,
		@DI.inject(DI.Stores.Register)
		public registerStore: IRegisterStore,
	) {}
}

export default RootStore
