import { IHandler } from "../Interfaces"
import { IRequest, IUpdateApplicationRequest, IUpdateApplicationResponse, EventTypes } from "shared";
import { IApplicationService } from '../../services/ApplicationService'
import bind from "bind-decorator";

export default class GetApplicationsHandler implements IHandler<IRequest, object> {
	constructor(readonly eventType: EventTypes, private readonly service: IApplicationService) {}

	@bind
	handle(req: IRequest) {
		return this.service.getApplications()
	}
}