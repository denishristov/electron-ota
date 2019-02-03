
import { Model } from 'mongoose'
import {
	GetVersionRequest,
	CreateVersionRequest,
	DeleteVersionRequest,
	DeleteVersionResponse,
	GetVersionsResponse,
	UpdateVersionRequest,
	UpdateVersionResponse,
	VersionRequest,
	GetVersionsRequest,
	VersionModel,
} from 'shared'
import { IVersionDocument } from '../models/Version'
import { toModel, byDateDesc } from '../util/util'
import { IAppDocument } from '../models/App'
import { IVersionReportsDocument } from '../models/VersionReports'

export interface IVersionService {
	getVersion({ id }: GetVersionRequest): Promise<VersionRequest>
	getVersions({ appId }: GetVersionsRequest): Promise<GetVersionsResponse>
	createVersion(createRequest: CreateVersionRequest): Promise<VersionModel>
	updateVersion(updateRequest: UpdateVersionRequest): Promise<UpdateVersionResponse>
	deleteVersion({ id }: DeleteVersionRequest): Promise<DeleteVersionResponse>
}

@DI.injectable()
export default class VersionService implements IVersionService {
	constructor(
		@DI.inject(DI.Models.Version)
		public readonly versions: Model<IVersionDocument>,
		@DI.inject(DI.Models.App)
		private readonly apps: Model<IAppDocument>,
		@DI.inject(DI.Models.VersionReports)
		private readonly versionReports: Model<IVersionReportsDocument>,
	) {}

	@bind
	public async getVersion({ id }: GetVersionRequest): Promise<VersionRequest> {
		const version = await this.versions.findById(id)

		return this.toModel(version)
	}

	@bind
	public async getVersions({ appId }: GetVersionsRequest): Promise<GetVersionsResponse> {
		const { versions } = await this.apps
			.findById(appId)
			.populate('versions')
			.sort('-versions._id')
			.select('versions')

		return {
			versions: versions.map(this.toModel).sort(byDateDesc),
		}
	}

	@bind
	public async createVersion({ appId, ...rest }: CreateVersionRequest): Promise<VersionModel> {
		const version = await this.versions.create({ app: appId, ...rest })

		await this.versionReports.create({
			downloaded: [],
			downloading: [],
			using: [],
			error: [],
			version: version.id,
			isReleased: false,
		})

		await this.apps.findByIdAndUpdate(appId, {
			$push: {
				versions: version,
			},
		})

		return this.toModel(version)
	}

	@bind
	public async updateVersion(update: UpdateVersionRequest): Promise<UpdateVersionResponse> {
		await this.versions.findByIdAndUpdate(update.id, update)
		return update
	}

	@bind
	public async deleteVersion({ id, appId }: DeleteVersionRequest): Promise<DeleteVersionResponse> {
		await this.versions.findByIdAndRemove(id)
		return { id, appId }
	}

	private toModel(version: IVersionDocument): VersionModel {
		return { ...toModel(version), appId: `${version.app}` }
	}
}
