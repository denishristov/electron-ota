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
	IVersionSimpleReportModel,
	IGetVersionSimpleReportsResponse,
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
	simpleReports: ObservableMap<string, IVersionSimpleReportModel>
	allVersions: IVersionModel[]
	getVersion(id: string): IVersionModel | null
	fetchVersions(): Promise<void>
	fetchSignedUploadVersionUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse>
	emitCreateVersion(inputFields: ICreateVersionInput): Promise<void>
	fetchSimpleReports(): Promise<void>
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

	public readonly simpleReports: ObservableMap<string, IVersionSimpleReportModel> = observable.map({})

	// public readonly clients: ObservableMap<string,

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

	@action
	public async emitCreateVersion(inputFields: ICreateVersionInput) {
		const res = await this.api.emit<ICreateVersionResponse>(
			EventType.CreateVersion,
			{ appId: this.id, ...inputFields },
		)

		this.versions.set(res.id, res)
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
		const { reports } = await this.api.emit<IGetVersionSimpleReportsResponse>(
			EventType.VersionSimpleReports,
			{ appId: this.id },
		)

		const grouped = reports.group((report) => [report.version, report])

		this.simpleReports.merge(grouped)
	}

	// emitUpdateVersion(inputFields: ICreateVersionInput) {
	// 	this.api.emit<ICreateVersionResponse>(EventType.CreateApp, { appId: this.id, ...inputFields })
	// }

	// emitDeleteVersion(inputFields: ICreateVersionInput) {
	// 	this.api.emit<ICreateVersionResponse>(EventType.CreateApp, { appId: this.id, ...inputFields })
	// }
}
