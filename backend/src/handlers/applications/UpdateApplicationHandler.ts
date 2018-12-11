import { IHandler } from "../Interfaces"
import { IUpdateApplicationRequest, IUpdateApplicationResponse, EventTypes } from "shared";
import { IApplicationService } from '../../services/ApplicationService'
import bind from "bind-decorator";

export default class UpdateApplicationHandler implements IHandler<IUpdateApplicationRequest, IUpdateApplicationResponse> {
	readonly eventType: EventTypes = EventTypes.UpdateApplication
	
	constructor(private readonly service: IApplicationService) {}

	@bind
	handle(req: IUpdateApplicationRequest) {
		return this.service.updateApplication(req)
	}
}