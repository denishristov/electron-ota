import { IHandler } from "../Interfaces"
import { IUpdateApplicationRequest, IUpdateApplicationResponse, EventTypes } from "shared";
import { IApplicationService } from '../../services/ApplicationService'
import bind from "bind-decorator";

export default class UpdateApplicationHandler implements IHandler<IUpdateApplicationRequest, IUpdateApplicationResponse> {
	constructor(readonly eventType: EventTypes, private readonly service: IApplicationService) {}

	@bind
	handle(req: IUpdateApplicationRequest) {
		return this.service.updateApplication(req)
	}
}