import App, { AppDocument } from '../models/App'
import { 
	ICreateAppRequest,
	ICreateAppResponse,
	IUpdateAppRequest,
	IUpdateAppResponse,
	IDeleteAppRequest,
	IDeleteAppResponse
} from 'shared'

export interface IAppService {
	getApps(): Promise<any>
	createApp(createRequest: ICreateAppRequest): Promise<ICreateAppResponse>
	updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse>
	deleteApp(deleteRequest: IDeleteAppRequest): Promise<IDeleteAppResponse>
}

export default class AppService {
	async getApps(): Promise<any> {
		return (await App.find()).toObject(({ id, name, isCritical, iconUploadId }) => [id, { 
			id, 
			name, 
			isCritical,
			iconUploadId 
		}])
	}

	async createApp(createRequest: ICreateAppRequest): Promise<ICreateAppResponse> {
		const app = await App.create(createRequest)
		return { id: app.id, ...app as ICreateAppResponse }
	}

	async updateApp(updateRequest: IUpdateAppRequest): Promise<IUpdateAppResponse> {
		const { id, ...app } = updateRequest
		await App.find(id, { $set: app })
		return updateRequest  
	}

	async deleteApp({ id }: IDeleteAppRequest): Promise<IDeleteAppResponse> {
		await App.deleteOne({ _id: id })
		return { id }
	}
}