import bind from 'bind-decorator';
import Application, { ApplicationDocument, IApplication, IApplicationUpdate } from '../models/Application'

export default class ApplicationManager {
	constructor() {

	}

	@bind
	async getApplications(): Promise<Map<string, ApplicationDocument>> {
		const applications = await Application.find() 
		return applications.toMap(application => [application._id.toHexString(), application])
	}

	@bind
	async createApplication(application: IApplication): Promise<ApplicationDocument> {
		return await Application.create(application)
	}

	@bind
	async updateApplication({ id, ...application }: IApplicationUpdate): Promise<ApplicationDocument> {
		return await Application.findByIdAndUpdate(id, { $set: application })
	}

	@bind
	async deleteApplication(applicationId: string): Promise<ApplicationDocument> {
		return await Application.deleteOne({ _id: applicationId })
	}
}