import { inject, injectable } from 'inversify'
import  { Stores } from '../dependencies/symbols'
import { IAppsStore } from './AppsStore'
import { IUserStore } from './UserStore'

export interface IRootStore {
	userStore: IUserStore
	appsStore: IAppsStore
}

export function injectUserStore({ userStore }: IRootStore): { userStore: IUserStore } {
	return { userStore }
}

export function injectAppsStore({ appsStore }: IRootStore): { appsStore: IAppsStore } {
	return { appsStore }
}

@injectable()
class RootStore implements IRootStore {
	constructor(
		@inject(Stores.Apps) public appsStore: IAppsStore,
		@inject(Stores.User) public userStore: IUserStore,
	) {}
}

export default RootStore
