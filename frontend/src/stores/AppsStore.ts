import { action, computed, observable, ObservableMap } from 'mobx'
import {
	EventType,
	CreateAppResponse,
	DeleteAppRequest,
	DeleteAppResponse,
	GetAppsResponse,
	UpdateAppRequest,
	UpdateAppResponse,
	UpdateVersionResponse,
	PublishVersionResponse,
	CreateVersionResponse,
	DeleteVersionResponse,
	CreateAppRequest,
	SystemType,
	ISystemTypeCount,
	ReportModelResponse,
	IGroupedReportModel,
} from 'shared'
import { IApi } from '../services/Api'
import { IApp } from './App'
import { AppFactory } from './factories/AppFactory'
import { getDefaultSimpleStatistics, memoize, isDifferenceLongerThanHour } from '../util/functions'
import { defaultSystemCounts } from '../util/constants/defaults'

interface IClient {
	versionName: string
	systemType: SystemType
	bundleId: string
}

export interface IAppsStore {
	allApps: IApp[]
	getApp(id: string): IApp | null
	fetchApps(): Promise<void>
	createApp(createAppRequest: CreateAppRequest): void
	updateApp(updateAppRequest: UpdateAppRequest): void
	deleteApp(deleteAppRequest: DeleteAppRequest): void
}

@injectable()
export default class AppsStore implements IAppsStore {
	private readonly apps: ObservableMap<string, IApp> = observable.map({})

	private readonly liveCounters = observable.map<string, ISystemTypeCount>({})

	constructor(
		@inject(nameof<IApi>())
		private readonly api: IApi,
		@inject(nameof<AppFactory>())
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
			.on(EventType.ClientConnected, this.handleClientConnected)
			.on(EventType.ClientDisconnected, this.handleClientDisconnected)
			.on(EventType.ReleaseUpdate, this.handleVersionPublished)
	}

	@computed
	get allApps(): IApp[] {
		return Array.from(this.apps.values()) || []
	}

	public getApp(id: string): IApp | null {
		return this.apps.get(id) || null
	}

	@memoize
	@action
	public async fetchApps(): Promise<void> {
		const { apps } = await this.api.fetch({
			eventType: EventType.GetApps,
			responseType: GetAppsResponse,
		})

		this.apps.merge(apps.map(this.appFactory).group((app) => [app.id, app]))
	}

	@memoize
	@action
	public async fetchAppsLiveCount(): Promise<void> {
		const counters = await this.api.fetch({
			eventType: EventType.GetAppsClientCount,
		})

		this.liveCounters.merge(counters)
	}

	public createApp(createAppRequest: CreateAppRequest): void {
		this.api.fetch({
			eventType: EventType.CreateApp,
			request: createAppRequest,
			requestType: CreateAppRequest,
			responseType: CreateAppResponse,
		})
	}

	public updateApp(updateAppRequest: UpdateAppRequest): void {
		this.api.fetch({
			eventType: EventType.UpdateApp,
			request: updateAppRequest,
			requestType: UpdateAppRequest,
			responseType: UpdateAppResponse,
		})
	}

	public deleteApp(deleteAppRequest: DeleteAppRequest): void {
		this.api.fetch({
			eventType: EventType.DeleteApp,
			request: deleteAppRequest,
			requestType: DeleteAppRequest,
			responseType: DeleteAppResponse,
		})
	}

	@action.bound
	private handleCreateApp(app: CreateAppResponse): void {
		this.apps.set(app.id, this.appFactory(app))
	}

	@action.bound
	private handleUpdateApp(updateAppResponse: UpdateAppResponse): void {
		const existingApp = this.apps.get(updateAppResponse.id)
		existingApp && Object.assign(existingApp, updateAppResponse)
	}

	@action.bound
	private handleDeleteApp(deleteAppResponse: DeleteAppResponse): void {
		this.apps.delete(deleteAppResponse.id)
	}

	@action.bound
	private handleCreateVersion(version: CreateVersionResponse) {
		const app = this.apps.get(version.appId)

		if (app) {
			app.versions.set(version.id, version)
			app.simpleReports.set(version.id, getDefaultSimpleStatistics(version.id))
		}
	}

	@action.bound
	private handleUpdateVersion(response: UpdateVersionResponse) {
		const app = this.apps.get(response.appId)
		const existingVersion = app && app.versions.get(response.id)

		if (existingVersion) {
			Object.assign(existingVersion, response)
		}
	}

	@action.bound
	private handleDeleteVersion(response: DeleteVersionResponse) {
		const app = this.apps.get(response.appId)
		app && app.versions.delete(response.id)
	}

	@action.bound
	private handleDownloadingReport({ versionId, appId, ...report }: ReportModelResponse) {
		const app = this.getApp(appId)

		if (app) {
			const simpleReports = app.simpleReports.get(versionId)

			if (simpleReports) {
				simpleReports.downloadingCount++
			}

			const reports = app.reports.get(versionId)

			if (reports) {
				reports.downloading.push(report)
			}

			const groupedReports = app.groupedReports.get(versionId)

			this.updateGroupedReports(report.timestamp, groupedReports && groupedReports.downloading)
		}
	}

	@action.bound
	private handleDownloadedReport({ versionId, appId, ...report }: ReportModelResponse) {
		const app = this.getApp(appId)

		if (app) {
			const simpleReports = app.simpleReports.get(versionId)

			if (simpleReports) {
				simpleReports.downloadingCount--
				simpleReports.downloadedCount++
			}

			const reports = app.reports.get(versionId)

			if (reports) {
				reports.downloaded.push(report)
			}

			const groupedReports = app.groupedReports.get(versionId)

			this.updateGroupedReports(report.timestamp, groupedReports && groupedReports.downloaded)
		}
	}

	@action.bound
	private handleUsingReport({ versionId, appId, ...report }: ReportModelResponse) {
		const app = this.getApp(appId)

		if (app) {
			const simpleReports = app.simpleReports.get(versionId)

			if (simpleReports) {
				simpleReports.usingCount++
			}

			const reports = app.reports.get(versionId)

			if (reports) {
				reports.using.push(report)
			}

			const version = app.getVersion(versionId)

			if (version) {
				const usingReports = app.usingReports.get(version.versionName)

				if (usingReports) {
					++usingReports[report.client.systemType]
				}
			}

			const groupedReports = app.groupedReports.get(versionId)

			this.updateGroupedReports(report.timestamp, groupedReports && groupedReports.using)
		}
	}

	@action.bound
	private handleErrorReport({ versionId, appId, ...report }: ReportModelResponse) {
		const app = this.getApp(appId)

		if (app) {
			const simpleReports = app.simpleReports.get(versionId)

			if (simpleReports) {
				simpleReports.errorsCount++
			}

			const reports = app.reports.get(versionId)

			if (reports) {
				reports.errorMessages.push(report)
			}

			const groupedReports = app.groupedReports.get(versionId)

			this.updateGroupedReports(report.timestamp, groupedReports && groupedReports.errorMessages)
		}
	}

	@action.bound
	private handleClientConnected({ bundleId, versionName, systemType }: IClient) {
		if (!this.liveCounters.has(bundleId)) {
			this.liveCounters.set(bundleId, { ...defaultSystemCounts })
		}

		++this.liveCounters.get(bundleId)![systemType]

		const app = [...this.apps.values()].find((app) => app.bundleId === bundleId)

		if (app) {
			const { clientCounters } = app

			if (!clientCounters.has(versionName)) {
				clientCounters.set(versionName, { ...defaultSystemCounts })
			}

			++clientCounters.get(versionName)![systemType]
		}
	}

	@action.bound
	private handleClientDisconnected({ bundleId, versionName, systemType }: IClient) {
		if (!this.liveCounters.has(bundleId)) {
			this.liveCounters.set(bundleId, { ...defaultSystemCounts })
		}

		--this.liveCounters.get(bundleId)![systemType]

		const app = [...this.apps.values()].find((app) => app.bundleId === bundleId)

		if (app) {
			const { clientCounters } = app

			if (!clientCounters.has(versionName)) {
				clientCounters.set(versionName, { ...defaultSystemCounts })
			}

			--clientCounters.get(versionName)![systemType]
		}
	}

	@action.bound
	private handleVersionPublished({ versionId, appId, releasedBy }: PublishVersionResponse) {
		const app = this.apps.get(appId)

		if (app) {
			const version = app.versions.get(versionId)

			if (version) {
				version.isReleased = true
				version.releasedBy = releasedBy

				if (app.latestVersions) {
					for (const key of Object.keys(version.systems)) {
						app.latestVersions[key] = version
					}
				}
			}
		}
	}

	@action
	private updateGroupedReports(timestamp: string, groupedReports?: IGroupedReportModel[]) {
		if (groupedReports) {
			const date = new Date(timestamp)
			const lastReport = groupedReports[groupedReports.length - 1]
			const lastDate = lastReport && new Date(lastReport.timestamp)

			if (lastDate && !isDifferenceLongerThanHour(date, lastDate)) {
				++lastReport.count
			} else {
				groupedReports.push({ timestamp, count: 1 })
			}
		}
	}
}
