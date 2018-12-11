import { IHandler } from "../Interfaces"
import { IRequest, IUpdateApplicationRequest, IUpdateApplicationResponse, EventTypes } from "shared";
import { IApplicationService } from '../../services/ApplicationService'
import bind from "bind-decorator";

export default class GetApplicationsHandler implements IHandler<IRequest, object> {
	readonly eventType: EventTypes = EventTypes.GetApplications
	
	constructor(private readonly service: IApplicationService) {}

	@bind
	handle(req: IRequest) {
		return this.service.getApplications()
	}
}