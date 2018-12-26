
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

export interface IAppService {
	getApps(): Promise<IGetAppsResponse>
	createApp(createRequest: ICreateAppRequest): Promise<ICreateAppResponse>
	updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse>
	deleteApp(deleteRequest: IDeleteAppRequest): Promise<IDeleteAppResponse>
}

@DI.injectable()
export default class AppService {
	constructor(
		@DI.inject(DI.Models.App) private readonly appModel: Model<IAppDocument>,
	) {}

	@bind
	public async getApps(): Promise<IGetAppsResponse> {
		const apps = await this.appModel.find()

		return {
			apps: apps.map(({
				bundleId,
				id,
				name,
				pictureUrl,
				latestVersion,
			}) => ({
				bundleId,
				id,
				name,
				pictureUrl,
				latestVersion,
			})),
		}
	}

	@bind
	public async createApp(createRequest: ICreateAppRequest): Promise<ICreateAppResponse> {
		const {
			id,
			pictureUrl,
			bundleId,
			name,
			latestVersion,
		} = await this.appModel.create(createRequest)

		return {
			bundleId,
			id,
			name,
			pictureUrl,
			latestVersion,
		}
	}

	@bind
	public async updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse> {
		const { id, ...app } = updateRequest
		await this.appModel.updateOne({ _id: id }, { $set: app })
		return updateRequest
	}

	@bind
	public async deleteApp({ id }: IDeleteAppRequest): Promise<IDeleteAppResponse> {
		await this.appModel.deleteOne({ _id: id })
		return { id }
	}
}
