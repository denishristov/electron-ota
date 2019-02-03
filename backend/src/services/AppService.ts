
import { Model } from 'mongoose'
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
import { IAppDocument } from '../models/App'
import { toModel } from '../util/util'
import { IVersionDocument } from '../models/Version'

export interface IAppService {
	getAllBundleIds(): Promise<string[]>
	getApp(id: string, options?: IGetAppOptions): Promise<IAppDocument>
	getAppVersions(id: string): Promise<{ versions: IVersionDocument[] }>
	getAppLatestVersion(id: string, systemType: SystemType): Promise<IVersionDocument>
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
		private readonly apps: Model<IAppDocument>,
	) {}

	public async getAllBundleIds(): Promise<string[]> {
		const apps = await this.apps.find().select('bundleId')
		return apps.map((app) => app.bundleId)
	}

	public async getApp(
		id: string,
		{ versions, latestVersions }: IGetAppOptions = { versions: false, latestVersions: false },
	): Promise<IAppDocument> {
		const populate = [
			versions && 'versions',
			latestVersions && 'latestVersions',
		].filter(Boolean).join(' ')

		return await this.apps
			.findById(id)
			.populate(populate)
	}

	public async getAppVersions(id: string): Promise<{ versions: IVersionDocument[] }> {
		return await this.apps
			.findById(id)
			.populate('versions')
			.select('versions')
			.sort({ 'versions.updatedAt': -1 })
	}

	@bind
	public async getAllApps(): Promise<GetAppsResponse> {
		const apps = await this.apps.find().populate('latestVersions')

		return {
			apps: apps.map(toModel).map((app) => ({
				...app,
				versions: app.versions && app.versions.length,
			})),
		}
	}

	@bind
	public async createApp(createRequest: CreateAppRequest): Promise<CreateAppResponse> {
		const app = await this.apps.create({
			...createRequest,
			latestVersions: {
				Windows_RT: null,
				Darwin: null,
				Linux: null,
			},
		})

		const { versions, ...rest } = toModel(app)

		return { ...rest, versions: versions.length }
	}

	@bind
	public async updateApp(updateRequest: UpdateAppRequest): Promise<UpdateAppResponse> {
		const { id, ...app } = updateRequest
		await this.apps.updateOne({ _id: id }, { $set: app })
		return updateRequest
	}

	@bind
	public async deleteApp({ id }: DeleteAppRequest): Promise<DeleteAppResponse> {
		await this.apps.deleteOne({ _id: id })
		return { id }
	}

	public async getAppLatestVersion(id: string, systemType: SystemType) {
		if (!Object.values(SystemType).includes(systemType)) {
			throw new Error('wrong type')
		}

		const { latestVersions } = await this.apps
			.findById(id)
			.populate({
				path: 'latestVersions',
				populate: {
					path: 'version',
				},
			})
			.select('latestVersions')

		return latestVersions[systemType]
	}
}
