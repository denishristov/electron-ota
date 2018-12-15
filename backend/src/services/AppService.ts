import App, { AppDocument } from '../models/App'
import {
	IGetAppsResponse,
	ICreateAppRequest,
	ICreateAppResponse,
	IUpdateAppRequest,
	IUpdateAppResponse,
	IDeleteAppRequest,
	IDeleteAppResponse
} from 'shared'
import { injectable } from 'inversify';

export interface IAppService {
	getApps(): Promise<IGetAppsResponse>
	createApp(createRequest: ICreateAppRequest): Promise<ICreateAppResponse>
	updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse>
	deleteApp(deleteRequest: IDeleteAppRequest): Promise<IDeleteAppResponse>
}

@injectable()
export default class AppService {
	async getApps(): Promise<IGetAppsResponse> {
		const apps = await App.find()

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
		} = await App.create(createRequest)

		return {
			id,
			pictureUrl,
			bundleId,
			name
		}
	}

	async updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse> {
		const { id, ...app } = updateRequest
		await App.find(id, { $set: app })
		return null  
	}

	async deleteApp({ id }: IDeleteAppRequest): Promise<IDeleteAppResponse> {
		await App.deleteOne({ _id: id })
		return { id }
	}
}