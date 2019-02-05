import { action, computed, observable, ObservableMap } from 'mobx'
import {
	EventType,
	GetVersionsResponse,
	S3SignUrlRequest,
	S3SignUrlResponse,
	VersionModel,
	SystemType,
	SimpleVersionReportModel,
	GetSimpleVersionReportsResponse,
	GetVersionReportsResponse,
	VersionReportModel,
	VersionEditModel,
	AppModel,
	LatestVersionsModel,
} from 'shared'
import { IApi } from '../util/Api'
import { Omit } from 'react-router'
import { byDateDesc } from '../util/functions';

interface ICreateVersionInput {
	versionName: string
	isCritical: boolean
	isBase: boolean
	description: string
	downloadUrl?: string
	hash?: string
	systems: {
		[key in SystemType]: boolean
	}
}

export interface IApp {
	id: string
	name: string
	pictureUrl?: string
	bundleId: string
	latestVersions?: LatestVersionsModel
	versionsCount: number
	latestAddedVersion: VersionModel | null
	versions: ObservableMap<string, VersionModel>
	simpleReports: ObservableMap<string, SimpleVersionReportModel>
	reports: ObservableMap<string, VersionReportModel>
	allVersions: VersionModel[]
	getVersion(id: string): VersionModel | null
	fetchVersions(): Promise<void>
	fetchSignedUploadVersionUrl(req: S3SignUrlRequest): Promise<S3SignUrlResponse>
	fetchSimpleReports(): Promise<void>
	fetchReports(versionId: string): Promise<void>
	createVersion(inputFields: ICreateVersionInput): void
	updateVersion(inputFields: Omit<VersionEditModel, 'appId'>): void
	deleteVersion(id: string): void
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

	public readonly versions: ObservableMap<string, VersionModel> = observable.map({})

	public readonly simpleReports: ObservableMap<string, SimpleVersionReportModel> = observable.map({})

	public readonly reports: ObservableMap<string, VersionReportModel> = observable.map({})

	constructor(
		{
			id,
			name,
			pictureUrl,
			bundleId,
			latestVersions,
			versions,
		}: AppModel,
		private readonly api: IApi,
	) {
		this.id = id
		this.name = name
		this.pictureUrl = pictureUrl
		this.bundleId = bundleId
		this.latestVersions = latestVersions
		this.versionsCount = versions
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

	@action
	public async fetchVersions() {
		const { versions } = await this.api.emit<GetVersionsResponse>(EventType.GetVersions, { appId: this.id })

		this.versions.merge(versions.group((version) => [version.id, version]))
	}

	@action
	public async fetchSignedUploadVersionUrl(req: S3SignUrlRequest) {
		return await this.api.emit<S3SignUrlResponse>(EventType.SignUploadVersionUrl, req)
	}

	@action
	public async fetchSimpleReports() {
		const { reports } = await this.api.emit<GetSimpleVersionReportsResponse>(
			EventType.SimpleVersionReports,
			{ appId: this.id },
		)

		const grouped = reports.group((report) => [report.version, report])

		this.simpleReports.merge(grouped)
	}

	@action
	public async fetchReports(versionId: string) {
		const reports = await this.api.emit<GetVersionReportsResponse>(EventType.VersionReports, { versionId })
		this.reports.set(versionId, reports)
	}

	public createVersion(inputFields: ICreateVersionInput) {
		this.api.emit(EventType.CreateVersion, { appId: this.id, ...inputFields })
	}

	public updateVersion(inputFields: Omit<VersionEditModel, 'appId'>) {
		this.api.emit(EventType.UpdateVersion, { appId: this.id, ...inputFields })
	}

	public deleteVersion(id: string) {
		this.api.emit(EventType.DeleteVersion, { appId: this.id, id })
	}
}
