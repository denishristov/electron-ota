import bind from 'bind-decorator';
import Application, { ApplicationDocument } from '../models/Application'
import { 
	ICreateApplicationRequest,
	ICreateApplicationResponse,
	IUpdateApplicationRequest,
	IUpdateApplicationResponse,
	IDeleteApplicationRequest,
	IDeleteApplicationResponse
} from 'shared'

export interface IApplicationService {
	getApplications(): Promise<Map<string, ApplicationDocument>>
	createApplication(createRequest: ICreateApplicationRequest): Promise<ICreateApplicationResponse>
	updateApplication(updateRequest: IUpdateApplicationRequest): Promise<IUpdateApplicationResponse>
	deleteApplication(deleteRequest: IDeleteApplicationRequest): Promise<IDeleteApplicationResponse>
}

export default class ApplicationService {
	constructor() {

	}

	@bind
	async getApplications(): Promise<any> {
		const applications = await Application.find() 
		return applications.toObject(application => [application._id, application as ICreateApplicationResponse])
	}

	@bind
	async createApplication(createRequest: ICreateApplicationRequest): Promise<ICreateApplicationResponse> {
		return await Application.create(createRequest)
	}

	@bind
	async updateApplication(updateRequest: IUpdateApplicationRequest): Promise<IUpdateApplicationResponse> {
		const { id, ...application } = updateRequest
		await Application.findByIdAndUpdate(id, { $set: application })
		return updateRequest  
	}

	@bind
	async deleteApplication({ id }: IDeleteApplicationRequest): Promise<IDeleteApplicationResponse> {
		await Application.deleteOne({ _id: id })
		return { id }
	}
}