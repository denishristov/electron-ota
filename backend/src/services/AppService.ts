import { inject, injectable } from 'inversify'
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
import { Models } from '../dependencies/symbols'
import { IAppDocument } from '../models/App'

export interface IAppService {
	getApps(): Promise<IGetAppsResponse>
	createApp(createRequest: ICreateAppRequest): Promise<ICreateAppResponse>
	updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse>
	deleteApp(deleteRequest: IDeleteAppRequest): Promise<IDeleteAppResponse>
}

@injectable()
export default class AppService {
	constructor(
		@inject(Models.App) private readonly appModel: Model<IAppDocument>,
	) {}

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
		// .toObject(app => [app.id, app]) as IGetAppsResponse
	}

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

	public async updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse> {
		const { id, ...app } = updateRequest
		await this.appModel.updateOne({ _id: id }, { $set: app })
		return updateRequest
	}

	public async deleteApp({ id }: IDeleteAppRequest): Promise<IDeleteAppResponse> {
		await this.appModel.deleteOne({ _id: id })
		return { id }
	}
}
