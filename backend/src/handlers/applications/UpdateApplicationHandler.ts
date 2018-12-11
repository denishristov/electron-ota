import { IHandler } from "../Interfaces"
import { IRequest } from "shared";
import { IApplicationService } from '../../services/ApplicationService'
import bind from "bind-decorator";

export default class GetApplicationsHandlers implements IHandler<IRequest, object> {
	constructor(readonly eventType: string, private readonly service: IApplicationService) {}

	@bind
	handle(req: IRequest) {
		return this.service.getApplications()
	}
}