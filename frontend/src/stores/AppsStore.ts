import { IApi } from "../util/Api"
import { observable, ObservableMap, action, computed } from "mobx"
import { EventType, ICreateAppResponse, IUpdateAppRequest, IUpdateAppResponse, IDeleteAppRequest, IDeleteAppResponse, IGetAppsResponse, IAppModel } from "shared"
import bind from 'bind-decorator'
import { ICreateAppRequest } from 'shared'
import App from "./App";
import { string } from "prop-types";

export default class AppsStore {
	private readonly apps: ObservableMap<string, App> = observable.map({})

	constructor(private readonly api: IApi) {
		this.api.on(EventType.CreateApp, this.handleCreateApp)
		this.api.on(EventType.UpdateApp, this.handleUpdateApp)
		this.api.on(EventType.DeleteApp, this.handleDeleteApp)
	}

	@computed
	get renderableApps(): App[] {
		return [...this.apps.values()]
	}

	@action
	async fetchApps(): Promise<void> { 
		const { apps } = await this.api.emit<IGetAppsResponse>(EventType.GetApps)
		const appMap = apps.map(app => new App(app, this.api)).group(app => [app.id, app])
		this.apps.merge(appMap)
	}

	@action.bound
	handleCreateApp(createAppResponse: ICreateAppResponse): void {
		console.log(createAppResponse)
		this.apps.set(createAppResponse.id, new App(createAppResponse, this.api))
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