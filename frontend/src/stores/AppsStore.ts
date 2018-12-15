import { IApi } from "../util/Api"
import { observable, ObservableMap, action, computed } from "mobx"
import { 
	EventType,
	ICreateAppResponse, 
	IUpdateAppRequest, 
	IUpdateAppResponse, 
	IDeleteAppRequest, 
	IDeleteAppResponse, 
	IGetAppsResponse, 
	ICreateVersionResponse, 
	IUpdateVersionResponse 
} from "shared"
import { ICreateAppRequest } from 'shared'
import App from "./App";
import { injectable, inject } from "inversify"
import { TYPES } from "../util/types";

export interface IAppsStore {

}

@injectable()
export default class AppsStore implements IAppsStore {
	@inject(TYPES.Api) 
	api: IApi
	
	private readonly apps: ObservableMap<string, App> = observable.map({})

	constructor() {
		this.api.on(EventType.CreateApp, this.handleCreateApp)
		this.api.on(EventType.UpdateApp, this.handleUpdateApp)
		this.api.on(EventType.DeleteApp, this.handleDeleteApp)

		this.api.on(EventType.CreateVersion, this.handleCreateVersion)
		this.api.on(EventType.UpdateVersion, this.handleUpdateVersion)
		this.api.on(EventType.DeleteVersion, this.handleDeleteVersion)
	}

	getApp(id: string): App | null {
		return this.apps.get(id) || null
	}

	@computed
	get renderableApps(): App[] {
		return [...this.apps.values()]
	}

	@action
	async fetchApps(): Promise<void> { 
		const { apps } = await this.api.emit<IGetAppsResponse>(EventType.GetApps)
		const appMap = apps.map(app => new App(app)).group(app => [app.id, app])
		this.apps.merge(appMap)
	}

	@action.bound
	handleCreateApp(createAppResponse: ICreateAppResponse): void {
		console.log(createAppResponse)
		this.apps.set(createAppResponse.id, new App(createAppResponse))
	}

	@action.bound
	handleUpdateApp(updateAppResponse: IUpdateAppResponse): void {
		const existingApp = this.apps.get(updateAppResponse.id)
		Object.assign(existingApp, updateAppResponse)
	}

	@action.bound
	handleDeleteApp(deleteAppResponse: IDeleteAppResponse): void {
		this.apps.delete(deleteAppResponse.id)
	}

	@action.bound
	handleCreateVersion(response: ICreateVersionResponse) {
		this.apps.get(response.appId)!.versions.set(response.id, response)
	}

	@action.bound
	handleUpdateVersion(response: IUpdateVersionResponse) {
		const existingVersion = this.apps.get(response.appId)!.versions.get(response.id)
		
		if (existingVersion) {
			Object.assign(existingVersion, response)
		}
	}

	@action.bound
	handleDeleteVersion(response: ICreateVersionResponse) {
		this.apps.get(response.appId)!.versions.delete(response.id)
		// this.versions.set(response.id, response)
	}

	emitCreateApp(createAppRequest: ICreateAppRequest): Promise<ICreateAppResponse> {
		return this.api.emit<ICreateAppResponse>(EventType.CreateApp, createAppRequest)
	}

	emitUpdateApp(updateAppRequest: IUpdateAppRequest): Promise<IUpdateAppResponse> {
		return this.api.emit<IUpdateAppResponse>(EventType.UpdateApp, updateAppRequest)
	}

	emitDeleteApp(deleteAppRequest: IDeleteAppRequest): Promise<IDeleteAppResponse> {
		return this.api.emit<IDeleteAppResponse>(EventType.DeleteApp, deleteAppRequest)
	}
}