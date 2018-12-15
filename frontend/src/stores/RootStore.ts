import { IUserStore } from "./UserStore"
import { IAppsStore } from "./AppsStore"
import { inject, injectable } from "inversify";
import { TYPES } from "../util/types";

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

	
	/**
	 *
	 */
	constructor(@inject(TYPES.UserStore) public userStore: IUserStore,

	@inject(TYPES.AppsStore) 
	public appsStore: IAppsStore
) {

	}
}

export default RootStore	