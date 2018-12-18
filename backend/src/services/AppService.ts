import { IAppDocument } from '../models/App'
import {
	IGetAppsResponse,
	ICreateAppRequest,
	ICreateAppResponse,
	IUpdateAppRequest,
	IUpdateAppResponse,
	IDeleteAppRequest,
	IDeleteAppResponse
} from 'shared'
import { injectable, inject } from 'inversify';
import { Models } from '../dependencies/symbols';
import { Model } from 'mongoose';

export interface IAppService {
	getApps(): Promise<IGetAppsResponse>
	createApp(createRequest: ICreateAppRequest): Promise<ICreateAppResponse>
	updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse>
	deleteApp(deleteRequest: IDeleteAppRequest): Promise<IDeleteAppResponse>
}

@injectable()
export default class AppService {
	constructor(
		@inject(Models.App) private readonly appModel: Model<IAppDocument>
	) {}

	async getApps(): Promise<IGetAppsResponse> {
		const apps = await this.appModel.find()

		return { 
			apps: apps.map(({
				id,
				bundleId,
				pictureUrl,
				name
			}) => ({
				id,
				bundleId,
				pictureUrl,
				name
			}))
		}
		// .toObject(app => [app.id, app]) as IGetAppsResponse
	}

	async createApp(createRequest: ICreateAppRequest): Promise<ICreateAppResponse> {
		const {
			id,
			pictureUrl,
			bundleId,
			name,
		} = await this.appModel.create(createRequest)

		return {
			id,
			pictureUrl,
			bundleId,
			name
		}
	}

	async updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse> {
		const { id, ...app } = updateRequest
		await this.appModel.find(id, { $set: app })
		return null  
	}

	async deleteApp({ id }: IDeleteAppRequest): Promise<IDeleteAppResponse> {
		await this.appModel.deleteOne({ _id: id })
		return { id }
	}
}