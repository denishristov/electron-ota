import { action, computed, observable, ObservableMap } from 'mobx'
import {
	EventType,
	IAppModel,
	ICreateVersionResponse,
	IGetVersionsResponse,
	IS3SignUrlRequest,
	IS3SignUrlResponse,
	IVersionModel,
	SystemType,
	ISimpleVersionReportModel,
	IGetSimpleVersionReportsResponse,
	IGetVersionReportsResponse,
	IVersionReportModel,
	IVersionEditModel,
} from 'shared'
import { IApi } from '../util/Api'

interface ICreateVersionInput {
	versionName: string
	isReleased: boolean
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
	pictureUrl: string
	bundleId: string
	latestVersion?: IVersionModel
	versionsCount: number
	versions: ObservableMap<string, IVersionModel>
	simpleReports: ObservableMap<string, ISimpleVersionReportModel>
	reports: ObservableMap<string, IVersionReportModel>
	allVersions: IVersionModel[]
	getVersion(id: string): IVersionModel | null
	fetchVersions(): Promise<void>
	fetchSignedUploadVersionUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse>
	fetchSimpleReports(): Promise<void>
	fetchReports(versionId: string): Promise<void>
	createVersion(inputFields: ICreateVersionInput): void
	updateVersion(inputFields: IVersionEditModel): void
	deleteVersion(id: string): void
}

export default class App implements IApp {
	public id: string

	@observable
	public name: string

	@observable
	public pictureUrl: string

	@observable
	public bundleId: string

	@observable
	public latestVersion?: IVersionModel

	@observable
	public versionsCount: number

	public readonly versions: ObservableMap<string, IVersionModel> = observable.map({})

	public readonly simpleReports: ObservableMap<string, ISimpleVersionReportModel> = observable.map({})

	public readonly reports: ObservableMap<string, IVersionReportModel> = observable.map({})

	constructor(
		{
			id,
			name,
			pictureUrl,
			bundleId,
			latestVersion,
			versions,
		}: IAppModel,
		private readonly api: IApi,
	) {
		this.id = id
		this.name = name
		this.pictureUrl = pictureUrl
		this.bundleId = bundleId
		this.latestVersion = latestVersion
		this.versionsCount = versions
	}

	public getVersion(id: string): IVersionModel | null {
		return this.versions.get(id) || null
	}

	@computed
	get allVersions(): IVersionModel[] {
		return Array.from(this.versions.values())
	}

	@action
	public async fetchVersions() {
		const { versions } = await this.api.emit<IGetVersionsResponse>(EventType.GetVersions, { appId: this.id })

		this.versions.merge(versions.group((version) => [version.id, version]))
	}

	@action
	public async fetchSignedUploadVersionUrl(req: IS3SignUrlRequest) {
		return await this.api.emit<IS3SignUrlResponse>(EventType.SignUploadVersionUrl, req)
	}

	public toModel(): IAppModel {
		return {
			id: this.id,
			pictureUrl: this.pictureUrl,
			name: this.name,
			bundleId: this.bundleId,
			versions: this.versions.size || this.versionsCount,
			latestVersion: this.latestVersion,
		}
	}

	@action
	public async fetchSimpleReports() {
		const { reports } = await this.api.emit<IGetSimpleVersionReportsResponse>(
			EventType.SimpleVersionReports,
			{ appId: this.id },
		)

		const grouped = reports.group((report) => [report.version, report])

		this.simpleReports.merge(grouped)
	}

	@action
	public async fetchReports(versionId: string) {
		const reports = await this.api.emit<IGetVersionReportsResponse>(EventType.VersionReports, { versionId })
		this.reports.set(versionId, reports)
	}

	public createVersion(inputFields: ICreateVersionInput) {
		this.api.emit<ICreateVersionResponse>(
			EventType.CreateVersion,
			{ appId: this.id, ...inputFields },
		)
	}

	public updateVersion(inputFields: IVersionEditModel) {
		this.api.emit<ICreateVersionResponse>(EventType.UpdateVersion, { appId: this.id, ...inputFields })
	}

	public deleteVersion(id: string) {
		this.api.emit<ICreateVersionResponse>(EventType.DeleteVersion, { appId: this.id, id })
	}
}
