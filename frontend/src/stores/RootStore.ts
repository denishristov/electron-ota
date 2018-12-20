import { inject, injectable } from 'inversify'
import { TYPES } from '../util/types'
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
		@inject(TYPES.AppsStore) public appsStore: IAppsStore,
		@inject(TYPES.UserStore) public userStore: IUserStore,
	) {}
}

export default RootStore
