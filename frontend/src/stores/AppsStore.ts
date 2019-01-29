import { action, computed, observable, ObservableMap } from 'mobx'
import {
	EventType,
	ICreateAppResponse,
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
	IClientReportResponse,
	IErrorReportResponse,
	ICreateVersionResponse,
	IDeleteVersionResponse,
} from 'shared'
import { ICreateAppRequest } from 'shared'
import { IApi } from '../util/Api'
import { IApp } from './App'
import { AppFactory } from '../dependencies/factories/AppFactory'

export interface IAppsStore {
	allApps: IApp[]
	getApp(id: string): IApp | null
	fetchApps(): Promise<void>
	fetchUploadPictureUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse>
	emitCreateApp(createAppRequest: ICreateAppRequest): Promise<ICreateAppResponse>
	emitUpdateApp(updateAppRequest: IUpdateAppRequest): Promise<IUpdateAppResponse>
	emitDeleteApp(deleteAppRequest: IDeleteAppRequest): Promise<IDeleteAppResponse>
	emitPublishVersion(req: IPublishVersionRequest): Promise<IPublishVersionResponse>
}

@DI.injectable()
export default class AppsStore implements IAppsStore {
	private readonly apps: ObservableMap<string, IApp> = observable.map({})

	constructor(
		@DI.inject(DI.Api) private readonly api: IApi,
		@DI.inject(DI.Factories.App) private readonly appFactory: AppFactory,
	) {
		this.api
			.on(EventType.CreateApp, this.handleCreateApp)
			.on(EventType.UpdateApp, this.handleUpdateApp)
			.on(EventType.DeleteApp, this.handleDeleteApp)
			.on(EventType.CreateVersion, this.handleCreateVersion)
			.on(EventType.UpdateVersion, this.handleUpdateVersion)
			.on(EventType.DeleteVersion, this.handleDeleteVersion)
			.on(EventType.UpdateDownloading, this.handleDownloadingReport)
			.on(EventType.UpdateDownloaded, this.handleDownloadedReport)
			.on(EventType.UpdateUsing, this.handleUsingReport)
			.on(EventType.UpdateError, this.handleErrorReport)
	}

	public getApp(id: string): IApp | null {
		return this.apps.get(id) || null
	}

	@computed
	get allApps(): IApp[] {
		return Array.from(this.apps.values())
	}

	@action
	public async fetchApps(): Promise<void> {
		const { apps } = await this.api.emit<IGetAppsResponse>(EventType.GetApps)

		this.apps.merge(apps.map(this.appFactory).group((app) => [app.id, app]))
	}

	public fetchUploadPictureUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse> {
		return this.api.emit<IS3SignUrlResponse>(EventType.SignUploadPictureUrl, req)
	}

	@action.bound
	public handleCreateApp(app: ICreateAppResponse): void {
		this.apps.set(app.id, this.appFactory(app))
	}

	@action.bound
	public handleUpdateApp(updateAppResponse: IUpdateAppResponse): void {
		const existingApp = this.apps.get(updateAppResponse.id)
		existingApp && Object.assign(existingApp, updateAppResponse)
	}

	@action.bound
	public handleDeleteApp(deleteAppResponse: IDeleteAppResponse): void {
		this.apps.delete(deleteAppResponse.id)
	}

	@action.bound
	public handleCreateVersion(version: ICreateVersionResponse) {
		this.apps.get(version.appId)!.versions.set(version.id, version)
	}

	@action.bound
	public handleUpdateVersion(response: IUpdateVersionResponse) {
		const existingVersion = this.apps.get(response.appId)!.versions.get(response.id)

		if (existingVersion) {
			Object.assign(existingVersion, response)
		}
	}

	@action.bound
	public handleDeleteVersion(response: IDeleteVersionResponse) {
		const app = this.apps.get(response.appId)
		app && app.versions.delete(response.id)
	}

	@action.bound
	public handleDownloadingReport({ appId, versionId }: IClientReportResponse) {
		const app = this.getApp(appId)

		if (app) {
			const reports = app.simpleReports.get(versionId)

			if (reports) {
				reports.downloadingCount++
			}
		}
	}

	@action.bound
	public handleDownloadedReport({ appId, versionId }: IClientReportResponse) {
		const app = this.getApp(appId)

		if (app) {
			const reports = app.simpleReports.get(versionId)

			if (reports) {
				reports.downloadingCount--
				reports.downloadedCount++
			}
		}
	}

	@action.bound
	public handleUsingReport({ appId, versionId }: IClientReportResponse) {
		const app = this.getApp(appId)

		if (app) {
			const reports = app.simpleReports.get(versionId)

			if (reports) {
				reports.usingCount++
			}
		}
	}

	@action.bound
	public handleErrorReport({ appId, versionId }: IErrorReportResponse) {
		const app = this.getApp(appId)

		if (app) {
			const reports = app.simpleReports.get(versionId)

			if (reports) {
				reports.errorsCount++
			}
		}
	}

	public async emitCreateApp(createAppRequest: ICreateAppRequest): Promise <ICreateAppResponse> {
		const res = await this.api.emit<ICreateAppResponse>(EventType.CreateApp, createAppRequest)
		this.handleCreateApp(res)
		return res
	}

	public async emitUpdateApp(updateAppRequest: IUpdateAppRequest): Promise <IUpdateAppResponse> {
		const res = await this.api.emit<IUpdateAppResponse>(EventType.UpdateApp, updateAppRequest)
		this.handleUpdateApp(res)
		return res
	}

	public async emitDeleteApp(deleteAppRequest: IDeleteAppRequest): Promise <IDeleteAppResponse> {
		const res = await this.api.emit<IDeleteAppResponse>(EventType.DeleteApp, deleteAppRequest)
		this.handleDeleteApp(res)
		return res
	}

	public async emitPublishVersion(req: IPublishVersionRequest): Promise <IPublishVersionResponse> {
		const res = await this.api.emit<IPublishVersionResponse>(EventType.ReleaseUpdate, req)
		return res
	}
}
