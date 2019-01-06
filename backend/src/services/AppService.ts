
import { Model } from 'mongoose'
import {
	ICreateAppRequest,
	ICreateAppResponse,
	IDeleteAppRequest,
	IDeleteAppResponse,
	IGetAppsResponse,
	IUpdateAppRequest,
	IUpdateAppResponse,
} from 'shared'
import { IAppDocument } from '../models/App'
import { toPlain } from '../util/util'
import { IVersionDocument } from '../models/Version'

export interface IAppService {
	getApp(id: string, options?: IGetAppOptions): Promise<IAppDocument>
	getAppVersions(id: string): Promise<{ versions: IVersionDocument[] }>
	getAllApps(): Promise<IGetAppsResponse>
	createApp(createRequest: ICreateAppRequest): Promise<ICreateAppResponse>
	updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse>
	deleteApp(deleteRequest: IDeleteAppRequest): Promise<IDeleteAppResponse>
}

interface IGetAppOptions {
	versions?: boolean
	latestVersion?: boolean
}

@DI.injectable()
export default class AppService implements IAppService {
	constructor(
		@DI.inject(DI.Models.App)
		private readonly apps: Model<IAppDocument>,
	) {}

	public async getApp(
		id: string,
		{ versions, latestVersion }: IGetAppOptions = { versions: false, latestVersion: false },
	): Promise<IAppDocument> {
		return await this.apps
			.findById(id)
			.populate(`${versions ? 'versions' : ''}`)
			.populate(`${latestVersion ? 'latestVersion' : ''}`)
	}

	public async getAppVersions(id: string): Promise<{ versions: IVersionDocument[] }> {
		return await this.apps.findById(id).populate('versions').select('versions')
	}

	@bind
	public async getAllApps(): Promise<IGetAppsResponse> {
		const apps = await this.apps.find().populate('latestVersion')

		return {
			apps: apps.map(toPlain)
				.map(app => ({ ...app, versions: app.versions.length })),
		}
	}

	@bind
	public async createApp(createRequest: ICreateAppRequest): Promise<ICreateAppResponse> {
		const app = await this.apps.create(createRequest)

		return toPlain(app)
	}

	@bind
	public async updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse> {
		const { id, ...app } = updateRequest
		await this.apps.updateOne({ _id: id }, { $set: app })
		return updateRequest
	}

	@bind
	public async deleteApp({ id }: IDeleteAppRequest): Promise<IDeleteAppResponse> {
		await this.apps.deleteOne({ _id: id })
		return { id }
	}
}
