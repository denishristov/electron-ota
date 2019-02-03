import { action, computed, observable, ObservableMap } from 'mobx'
import {
	EventType,
	CreateAppResponse,
	DeleteAppRequest,
	DeleteAppResponse,
	GetAppsResponse,
	S3SignUrlRequest,
	S3SignUrlResponse,
	UpdateAppRequest,
	UpdateAppResponse,
	UpdateVersionResponse,
	PublishVersionRequest,
	PublishVersionResponse,
	ClientReportResponse,
	ErrorReportResponse,
	CreateVersionResponse,
	DeleteVersionResponse,
	CreateAppRequest,
} from 'shared'
import { IApi } from '../util/Api'
import { IApp } from './App'
import { AppFactory } from '../dependencies/factories/AppFactory'

export interface IAppsStore {
	allApps: IApp[]
	getApp(id: string): IApp | null
	fetchApps(): Promise<void>
	fetchUploadPictureUrl(req: S3SignUrlRequest): Promise<S3SignUrlResponse>
	createApp(createAppRequest: CreateAppRequest): void
	updateApp(updateAppRequest: UpdateAppRequest): void
	deleteApp(deleteAppRequest: DeleteAppRequest): void
	releaseUpdate(req: PublishVersionRequest): void
}

@DI.injectable()
export default class AppsStore implements IAppsStore {
	private readonly apps: ObservableMap<string, IApp> = observable.map({})

	constructor(
		@DI.inject(DI.Api)
		private readonly api: IApi,
		@DI.inject(DI.Factories.App)
		private readonly appFactory: AppFactory,
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
		const { apps } = await this.api.emit<GetAppsResponse>(EventType.GetApps)

		this.apps.merge(apps.map(this.appFactory).group((app) => [app.id, app]))
	}

	public fetchUploadPictureUrl(req: S3SignUrlRequest): Promise<S3SignUrlResponse> {
		return this.api.emit<S3SignUrlResponse>(EventType.SignUploadPictureUrl, req)
	}

	@action.bound
	public handleCreateApp(app: CreateAppResponse): void {
		this.apps.set(app.id, this.appFactory(app))
	}

	@action.bound
	public handleUpdateApp(updateAppResponse: UpdateAppResponse): void {
		const existingApp = this.apps.get(updateAppResponse.id)
		existingApp && Object.assign(existingApp, updateAppResponse)
	}

	@action.bound
	public handleDeleteApp(deleteAppResponse: DeleteAppResponse): void {
		this.apps.delete(deleteAppResponse.id)
	}

	@action.bound
	public handleCreateVersion(version: CreateVersionResponse) {
		this.apps.get(version.appId)!.versions.set(version.id, version)
	}

	@action.bound
	public handleUpdateVersion(response: UpdateVersionResponse) {
		const app = this.apps.get(response.appId)
		const existingVersion = app && app.versions.get(response.id)

		if (existingVersion) {
			Object.assign(existingVersion, response)
		}
	}

	@action.bound
	public handleDeleteVersion(response: DeleteVersionResponse) {
		const app = this.apps.get(response.appId)
		app && app.versions.delete(response.id)
	}

	@action.bound
	public handleDownloadingReport({ appId, versionId }: ClientReportResponse) {
		const app = this.getApp(appId)

		if (app) {
			const reports = app.simpleReports.get(versionId)

			if (reports) {
				reports.downloadingCount++
			}
		}
	}

	@action.bound
	public handleDownloadedReport({ appId, versionId }: ClientReportResponse) {
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
	public handleUsingReport({ appId, versionId }: ClientReportResponse) {
		const app = this.getApp(appId)

		if (app) {
			const reports = app.simpleReports.get(versionId)

			if (reports) {
				reports.usingCount++
			}
		}
	}

	@action.bound
	public handleErrorReport({ appId, versionId }: ErrorReportResponse) {
		const app = this.getApp(appId)

		if (app) {
			const reports = app.simpleReports.get(versionId)

			if (reports) {
				reports.errorsCount++
			}
		}
	}

	public createApp(createAppRequest: CreateAppRequest): void {
		this.api.emit<CreateAppResponse>(EventType.CreateApp, createAppRequest)
	}

	public updateApp(updateAppRequest: UpdateAppRequest): void {
		this.api.emit<UpdateAppResponse>(EventType.UpdateApp, updateAppRequest)
	}

	public deleteApp(deleteAppRequest: DeleteAppRequest): void {
		this.api.emit<DeleteAppResponse>(EventType.DeleteApp, deleteAppRequest)
	}

	public releaseUpdate(req: PublishVersionRequest): void {
		this.api.emit<PublishVersionResponse>(EventType.ReleaseUpdate, req)
	}
}
