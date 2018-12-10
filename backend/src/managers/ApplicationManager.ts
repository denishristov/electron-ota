import { EventTypes } from 'shared'
import ClientSocket from '../util/ClientSocket';
import { IApplicationService } from '../services/ApplicationService';

export default class ApplicationManager {
	constructor(client: ClientSocket, applicationService: IApplicationService) {
		const {
			CreateApplication,
			UpdateApplication,
			DeleteApplication,
			GetApplications
		} = EventTypes

		client.subscribe(GetApplications, applicationService.getApplications)
		client.subscribe(CreateApplication, applicationService.createApplication)
		client.subscribe(UpdateApplication, applicationService.updateApplication)
		client.subscribe(DeleteApplication, applicationService.deleteApplication)
	}
}