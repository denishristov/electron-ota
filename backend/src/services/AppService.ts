
import {
	CreateAppRequest,
	CreateAppResponse,
	DeleteAppRequest,
	DeleteAppResponse,
	GetAppsResponse,
	UpdateAppRequest,
	UpdateAppResponse,
	SystemType,
	GetVersionsRequest,
	GetVersionsResponse,
} from 'shared'
import { App } from '../models/App'
import { Version } from '../models/Version'
import { ModelType, InstanceType } from 'typegoose'
import { rangedArray } from '../util/functions'

export interface IAppService {
	getAllBundleIds(): Promise<string[]>
	getAllApps(): Promise<GetAppsResponse>
	getAppVersions({ appId }: GetVersionsRequest): Promise<GetVersionsResponse>
	getAppLatestVersion(bundleId: string, systemType: SystemType): Promise<Version | null>
	createApp(createRequest: CreateAppRequest): Promise<CreateAppResponse>
	updateApp(updateRequest: UpdateAppRequest): Promise<UpdateAppResponse>
	deleteApp(deleteRequest: DeleteAppRequest): Promise<DeleteAppResponse>
}

@injectable()
export default class AppService implements IAppService {
	constructor(
		@inject(nameof<App>())
		private readonly AppModel: ModelType<App>,
	) {}

	public async getAllBundleIds(): Promise<string[]> {
		const apps = await this.AppModel.find().select('bundleId')
		return apps.map((app) => app.bundleId)
	}

	@bind
	public async getAppVersions({ appId }: GetVersionsRequest): Promise<GetVersionsResponse> {
		const app = await this.AppModel
			.findById(appId)
			.populate({
				path: 'versions',
				options: { sort: { createdAt: -1 } },
				populate: {
					path: 'releasedBy',
					select: 'name email pictureUrl -_id',
				},
			})
			.select('versions')

		return {
			versions: app.versions.map((version) => (version as InstanceType<Version>).toJSON()),
		}
	}

	@bind
	public async getAllApps(): Promise<GetAppsResponse> {
		const apps = await this.AppModel.find()

		return {
			apps: await Promise.all(apps.map(async (app) => {
				const json = app.toJSON()

				const systemTypes = Object.keys(SystemType) as SystemType[]
				const latestVersions = await Promise.all(
					systemTypes.map((systemType) => this.getAppLatestVersion(app.bundleId, systemType)),
				)

				return {
					...json,
					versions: app.versions && app.versions.length,
					latestVersions: rangedArray(systemTypes.length)
						.group((i) => [systemTypes[i], latestVersions[i]]),
				}
			})),
		}
	}

	@bind
	public async createApp(createRequest: CreateAppRequest): Promise<CreateAppResponse> {
		const { AppModel } = this

		const app = new AppModel(createRequest)
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

	public async getAppLatestVersion(bundleId: string, systemType: SystemType) {
		if (!Object.values(SystemType).includes(systemType)) {
			throw new Error('Bad system type')
		}

		const app = await this.AppModel
			.findOne({ bundleId })
			.populate({
				path: 'versions',
				match: {
					[`systems.${systemType}`]: true,
					isReleased: true,
				},
				options: {
					limit: 1,
					sort: { createdAt: -1 },
				},
			})
			.select('latestVersions')

		return (app
			&& app.versions[0]
			&& (app.versions[0] as InstanceType<Version>).toJSON()
		) || null
	}
}
