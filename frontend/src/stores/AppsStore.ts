import { IApi } from "../util/Api"
import { observable, ObservableMap, action, computed } from "mobx"
import { EventType, ICreateAppResponse, IUpdateAppRequest, IUpdateAppResponse, IDeleteAppRequest, IDeleteAppResponse, IGetAppsResponse, IAppModel } from "shared"
import bind from 'bind-decorator'
import { ICreateAppRequest } from 'shared'

export default class AppsStore {
	private readonly apps: ObservableMap<string, IAppModel> = observable.map({})

	constructor(private readonly api: IApi) {
		this.api.on(EventType.CreateApp, this.handleCreateApp)
		this.api.on(EventType.UpdateApp, this.handleUpdateApp)
		this.api.on(EventType.DeleteApp, this.handleDeleteApp)
	}

	@computed
	get renderableApps(): IAppModel[] {
		return [...this.apps.values()]
	}

	@action
	async fetchApps(): Promise<void> { 
		this.apps.merge(await this.api.emit<IGetAppsResponse>(EventType.GetApps))
	}

	@action.bound
	handleCreateApp(createAppResponse: ICreateAppResponse): void {
		console.log(createAppResponse)
		this.apps.set(createAppResponse.id, createAppResponse)
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

	@bind
	emitCreateApp(createAppRequest: ICreateAppRequest): Promise<ICreateAppResponse> {
		return this.api.emit<ICreateAppResponse>(EventType.CreateApp, createAppRequest)
	}

	@bind
	emitUpdateApp(updateAppRequest: IUpdateAppRequest): Promise<IUpdateAppResponse> {
		return this.api.emit<IUpdateAppResponse>(EventType.UpdateApp, updateAppRequest)
	}

	@bind
	emitDeleteApp(deleteAppRequest: IDeleteAppRequest): Promise<IDeleteAppResponse> {
		return this.api.emit<IDeleteAppResponse>(EventType.DeleteApp, deleteAppRequest)
	}
}