
import {
	CreateAppRequest,
	CreateAppResponse,
	DeleteAppRequest,
	DeleteAppResponse,
	GetAppsResponse,
	UpdateAppRequest,
	UpdateAppResponse,
	SystemType,
} from 'shared'
import { App } from '../models/App'
import { Version } from '../models/Version'
import { ModelType } from 'typegoose'

export interface IAppService {
	getAllBundleIds(): Promise<string[]>
	getApp(id: string, options?: IGetAppOptions): Promise<App>
	getAppVersions(id: string): Promise<{ versions: Version[] }>
	getAppLatestVersion(id: string, systemType: SystemType): Promise<Version>
	getAllApps(): Promise<GetAppsResponse>
	createApp(createRequest: CreateAppRequest): Promise<CreateAppResponse>
	updateApp(updateRequest: UpdateAppRequest): Promise<UpdateAppResponse>
	deleteApp(deleteRequest: DeleteAppRequest): Promise<DeleteAppResponse>
}

interface IGetAppOptions {
	versions?: boolean
	latestVersions?: boolean
}

@DI.injectable()
export default class AppService implements IAppService {
	constructor(
		@DI.inject(DI.Models.App)
		private readonly AppModel: ModelType<App>,
	) {}

	public async getAllBundleIds(): Promise<string[]> {
		const apps = await this.AppModel.find().select('bundleId')
		return apps.map((app) => app.bundleId)
	}

	public async getApp(
		id: string,
		{ versions, latestVersions }: IGetAppOptions = { versions: false, latestVersions: false },
	): Promise<App> {
		const populate = [
			versions && 'versions',
			latestVersions && 'latestVersions',
		].filter(Boolean).join(' ')

		return await this.AppModel
			.findById(id)
			.populate(populate)
	}

	public async getAppVersions(id: string): Promise<{ versions: Version[] }> {
		const app = await this.AppModel
			.findById(id)
			.populate('versions')
			.select('versions')
			.sort({ 'versions.updatedAt': -1 })

		return { versions: app.versions as Version[] }
	}

	@bind
	public async getAllApps(): Promise<GetAppsResponse> {
		const apps = await this.AppModel.find().populate('latestVersions')

		return {
			apps: apps.map((app) => ({
				...app.toJSON(),
				versions: app.versions && app.versions.length,
			})),
		}
	}

	@bind
	public async createApp(createRequest: CreateAppRequest): Promise<CreateAppResponse> {
		const { AppModel } = this

		const app = await new AppModel(createRequest)
		await app.save()

		const { versions, ...rest } = app.toJSON()

		return { ...rest, versions: versions.length }
	}

	@bind
	public async updateApp(updateRequest: UpdateAppRequest): Promise<UpdateAppResponse> {
		const { id, ...app } = updateRequest

		await this.AppModel.updateOne({ _id: id }, { $set: app })

		return updateRequest
	}

	@bind
	public async deleteApp({ id }: DeleteAppRequest): Promise<DeleteAppResponse> {
		await this.AppModel.deleteOne({ _id: id })

		return { id }
	}

	public async getAppLatestVersion(id: string, systemType: SystemType) {
		if (!Object.values(SystemType).includes(systemType)) {
			throw new Error('Bad system type')
		}

		const { latestVersions } = await this.AppModel
			.findById(id)
			.populate({
				path: 'latestVersions',
				populate: {
					path: 'version',
				},
			})
			.select('latestVersions')

		return latestVersions[systemType] as Version
	}
}
