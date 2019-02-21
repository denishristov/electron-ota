import { action, computed, observable, ObservableMap } from 'mobx'
import {
	EventType,
	GetVersionsResponse,
	VersionModel,
	SystemType,
	SimpleVersionReportModel,
	GetSimpleVersionReportsResponse,
	GetVersionReportsResponse,
	VersionReportModel,
	VersionEditModel,
	AppModel,
	LatestVersionsModel,
	ISystemTypeCount,
	GetVersionsRequest,
	CreateVersionRequest,
	CreateVersionResponse,
	GetSimpleVersionReportsRequest,
	GetVersionReportsRequest,
	GetAppCountersRequest,
	UpdateVersionRequest,
	UpdateVersionResponse,
	DeleteVersionRequest,
	PublishVersionRequest,
	PublishVersionResponse,
} from 'shared'
import { IApi } from '../services/Api'
import { Omit } from 'react-router'
import { byDateDesc, memoize } from '../util/functions'

interface ICreateVersionInput {
	versionName: string
	isCritical: boolean
	isBase: boolean
	description: string
	downloadUrl?: string
	hash?: string
	fileName?: string
	isReleasing: boolean
	password?: string
	systems: {
		[key in SystemType]: boolean
	}
}

export interface IApp {
	id: string
	name: string
	pictureUrl?: string
	bundleId: string
	color: string
	latestVersions?: LatestVersionsModel
	versionsCount: number
	latestAddedVersion: VersionModel | null
	versions: ObservableMap<string, VersionModel>
	simpleReports: ObservableMap<string, SimpleVersionReportModel>
	reports: ObservableMap<string, VersionReportModel>
	clientCounters: ObservableMap<string, ISystemTypeCount>
	allVersions: VersionModel[]
	getVersion(id: string): VersionModel | null
	fetchVersions(): Promise<void>
	fetchSimpleReports(): Promise<void>
	fetchReports(versionId: string): Promise<void>
	fetchAppLiveCount(): Promise<void>
	createVersion(inputFields: ICreateVersionInput): Promise<void>
	updateVersion(inputFields: Omit<VersionEditModel, 'appId'>): Promise<void>
	deleteVersion(id: string): Promise<void>
	releaseUpdate(request: PublishVersionRequest): Promise<void>
}

export default class App implements IApp {
	public id: string

	@observable
	public name: string

	@observable
	public pictureUrl?: string

	@observable
	public bundleId: string

	@observable
	public latestVersions?: LatestVersionsModel

	@observable
	public versionsCount: number

	@observable
	public color: string

	public readonly versions = observable.map<string, VersionModel>({})

	public readonly simpleReports = observable.map<string, SimpleVersionReportModel>({})

	public readonly reports = observable.map<string, VersionReportModel>({})

	public readonly clientCounters = observable.map<string, ISystemTypeCount>({})

	constructor(
		{
			id,
			name,
			pictureUrl,
			bundleId,
			latestVersions,
			versions,
			color,
		}: AppModel,
		private readonly api: IApi,
	) {
		this.id = id
		this.name = name
		this.pictureUrl = pictureUrl
		this.bundleId = bundleId
		this.latestVersions = latestVersions
		this.versionsCount = versions
		this.color = color
	}

	public getVersion(id: string): VersionModel | null {
		return this.versions.get(id) || null
	}

	@computed
	get latestAddedVersion(): VersionModel | null {
		return this.allVersions[0] || null
	}

	@computed
	get allVersions(): VersionModel[] {
		return [...this.versions.values()].sort(byDateDesc)
	}

	@memoize
	@action
	public async fetchVersions() {
		const { versions } = await this.api.fetch({
			eventType: EventType.GetVersions,
			request: { appId: this.id },
			requestType: GetVersionsRequest,
			responseType: GetVersionsResponse,
		})

		this.versions.merge(versions.group((version) => [version.id, version]))
	}

	@memoize
	@action
	public async fetchSimpleReports() {
		const { reports } = await this.api.fetch({
			eventType: EventType.SimpleVersionReports,
			request: { appId: this.id },
			requestType: GetSimpleVersionReportsRequest,
			responseType: GetSimpleVersionReportsResponse,
		})

		const grouped = reports.group((report) => [report.version, report])

		this.simpleReports.merge(grouped)
	}

	@memoize
	@action
	public async fetchReports(versionId: string) {
		const reports = await this.api.fetch({
			eventType: EventType.VersionReports,
			request: { versionId },
			requestType: GetVersionReportsRequest,
			responseType: GetVersionReportsResponse,
		})

		this.reports.set(versionId, { ...reports })
	}

	@memoize
	@action
	public async fetchAppLiveCount() {
		const counters = await this.api.fetch({
			eventType: EventType.getAppClientCount,
			request: { bundleId: this.bundleId },
			requestType: GetAppCountersRequest,
		})

		this.clientCounters.merge(counters)
	}

	public async createVersion({ isReleasing, password, ...version }: ICreateVersionInput) {
		const { id } = await this.api.fetch({
			eventType: EventType.CreateVersion,
			request: { appId: this.id, ...version },
			requestType: CreateVersionRequest,
			responseType: CreateVersionResponse,
		})

		if (isReleasing && password) {
			this.releaseUpdate({ password, versionId: id })
		}
	}

	public async updateVersion(inputFields: Omit<VersionEditModel, 'appId'>) {
		await this.api.fetch({
			eventType: EventType.UpdateVersion,
			request: { appId: this.id, ...inputFields },
			requestType: UpdateVersionRequest,
			responseType: UpdateVersionResponse,
		})
	}

	public async deleteVersion(id: string) {
		await this.api.fetch({
			eventType: EventType.DeleteVersion,
			request: { appId: this.id, id },
			requestType: DeleteVersionRequest,
		})
	}

	public async releaseUpdate(request: PublishVersionRequest): Promise<void> {
		await this.api.fetch({
			eventType: EventType.ReleaseUpdate,
			request,
			requestType: PublishVersionRequest,
			responseType: PublishVersionResponse,
		})
	}
}
