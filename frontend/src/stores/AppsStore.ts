import { action, computed, observable, ObservableMap } from 'mobx'
import {
	EventType,
	ICreateAppResponse,
	ICreateVersionResponse,
	IDeleteAppRequest,
	IDeleteAppResponse,
	IGetAppsResponse,
	IS3SignUrlRequest,
	IS3SignUrlResponse,
	IUpdateAppRequest,
	IUpdateAppResponse,
	IUpdateVersionResponse,
	IPublishVersionRequest,
	IPublishVersionResponse,
} from 'shared'
import { ICreateAppRequest } from 'shared'
import { IApi } from '../util/Api'
import App from './App'

// tslint:disable-next-line:no-empty-interface
export interface IAppsStore {

}

@DI.injectable()
export default class AppsStore implements IAppsStore {
	private readonly apps: ObservableMap<string, App> = observable.map({})

	constructor(@DI.inject(DI.Api) private readonly api: IApi) {
		this.api.on(EventType.CreateApp, this.handleCreateApp)
		this.api.on(EventType.UpdateApp, this.handleUpdateApp)
		this.api.on(EventType.DeleteApp, this.handleDeleteApp)

		this.api.on(EventType.CreateVersion, this.handleCreateVersion)
		this.api.on(EventType.UpdateVersion, this.handleUpdateVersion)
		this.api.on(EventType.DeleteVersion, this.handleDeleteVersion)
	}

	public getApp(id: string): App | null {
		return this.apps.get(id) || null
	}

	@computed
	get allApps(): App[] {
		return Array.from(this.apps.values())
	}

	@action
	public async fetchApps(): Promise<void> {
		const { apps } = await this.api.emit<IGetAppsResponse>(EventType.GetApps)
		const appMap = apps.map((app) => new App(app, this.api)).group((app) => [app.id, app])
		this.apps.merge(appMap)
	}

	public fetchUploadPictureUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse> {
		return this.api.emit<IS3SignUrlResponse>(EventType.SignUploadPictureUrl, req)
	}

	@action.bound
	public handleCreateApp(createAppResponse: ICreateAppResponse): void {
		this.apps.set(createAppResponse.id, new App(createAppResponse, this.api))
	}

	@action.bound
	public handleUpdateApp(updateAppResponse: IUpdateAppResponse): void {
		const existingApp = this.apps.get(updateAppResponse.id)
		Object.assign(existingApp, updateAppResponse)
	}

	@action.bound
	public handleDeleteApp(deleteAppResponse: IDeleteAppResponse): void {
		this.apps.delete(deleteAppResponse.id)
	}

	@action.bound
	public handleCreateVersion(response: ICreateVersionResponse) {
		this.apps.get(response.appId)!.versions.set(response.id, response)
	}

	@action.bound
	public handleUpdateVersion(response: IUpdateVersionResponse) {
		const existingVersion = this.apps.get(response.appId)!.versions.get(response.id)

		if (existingVersion) {
			Object.assign(existingVersion, response)
		}
	}

	@action.bound
	public handleDeleteVersion(response: ICreateVersionResponse) {
		this.apps.get(response.appId)!.versions.delete(response.id)
	}

	public async emitCreateApp(createAppRequest: ICreateAppRequest): Promise<ICreateAppResponse> {
		const res = await this.api.emit<ICreateAppResponse>(EventType.CreateApp, createAppRequest)
		this.handleCreateApp(res)
		return res
	}

	public async emitUpdateApp(updateAppRequest: IUpdateAppRequest): Promise<IUpdateAppResponse> {
		const res = await this.api.emit<IUpdateAppResponse>(EventType.UpdateApp, updateAppRequest)
		this.handleUpdateApp(res)
		return res
	}

	public async emitDeleteApp(deleteAppRequest: IDeleteAppRequest): Promise<IDeleteAppResponse> {
		const res = await this.api.emit<IDeleteAppResponse>(EventType.DeleteApp, deleteAppRequest)
		this.handleDeleteApp(res)
		return res
	}

	public async emitPublishVersion({ id, appId }: IPublishVersionRequest): Promise<IPublishVersionResponse> {
		const res = await this.api.emit<IPublishVersionResponse>(EventType.PublishVersion, { id, appId })
		return res
	}
}
