
import { Model } from 'mongoose'
import {
	IGetVersionRequest,
	ICreateVersionRequest,
	ICreateVersionResponse,
	IDeleteVersionRequest,
	IDeleteVersionResponse,
	IGetVersionsResponse,
	IUpdateVersionRequest,
	IUpdateVersionResponse,
	IGetVersionResponse,
	IGetVersionsRequest,
} from 'shared'
import { IVersionDocument } from '../models/Version'
import { plain, byDateDesc } from '../util/util'
import { IAppDocument } from '../models/App'
import { IVersionStatisticsDocument } from '../models/VersionStatistics'

export interface IVersionService {
	versions: Model<IVersionDocument>
	getVersion({ id }: IGetVersionRequest): Promise<IGetVersionResponse>
	getVersions({ appId }: IGetVersionsRequest): Promise<IGetVersionsResponse>
	createVersion(createRequest: ICreateVersionRequest): Promise<ICreateVersionResponse>
	updateVersion(updateRequest: IUpdateVersionRequest): Promise<IUpdateVersionResponse>
	deleteVersion({ id }: IDeleteVersionRequest): Promise<IDeleteVersionResponse>
}

@DI.injectable()
export default class VersionService implements IVersionService {
	constructor(
		@DI.inject(DI.Models.Version)
		public readonly versions: Model<IVersionDocument>,
		@DI.inject(DI.Models.App)
		private readonly apps: Model<IAppDocument>,
		@DI.inject(DI.Models.VersionStatistics)
		private readonly versionStatistics: Model<IVersionStatisticsDocument>,
	) {}

	@bind
	public async getVersion({ id }: IGetVersionRequest): Promise<IGetVersionResponse> {
		const version = await this.versions.findById(id)

		return plain(version)
	}

	@bind
	public async getVersions({ appId }: IGetVersionsRequest): Promise<IGetVersionsResponse> {
		const { versions } = await this.apps
			.findById(appId)
			.populate('versions')
			.sort('-versions._id')
			.select('versions')

		return {
			versions: versions.map(plain).sort(byDateDesc),
		}
	}

	@bind
	public async createVersion(create: ICreateVersionRequest): Promise<ICreateVersionResponse> {
		const version = await this.versions.create(create)

		await this.versionStatistics.create({
			downloaded: [],
			downloading: [],
			using: [],
			error: [],
			version: version.id,
		})

		await this.apps.findByIdAndUpdate(create.appId, {
			$push: {
				versions: version,
			},
		})

		return this.toModel(version)
	}

	@bind
	public async updateVersion(update: IUpdateVersionRequest): Promise<IUpdateVersionResponse> {
		await this.versions.findByIdAndUpdate(update.id, update)
		return update
	}

	@bind
	public async deleteVersion({ id, appId }: IDeleteVersionRequest): Promise<IDeleteVersionResponse> {
		await this.versions.findByIdAndRemove(id)
		return { id, appId }
	}

	private toModel({ app, ...rest }: IVersionDocument) {
		return plain({ appId: `${app}`, rest })
	}
}
