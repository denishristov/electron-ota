import { IHandler } from "../Interfaces"
import { IRequest, IDeleteApplicationRequest, IDeleteApplicationResponse, EventTypes } from "shared";
import { IApplicationService } from '../../services/ApplicationService'
import bind from "bind-decorator";

export default class DeleteApplicationHandler implements IHandler<IDeleteApplicationRequest, IDeleteApplicationResponse> {
	constructor(readonly eventType: EventTypes, private readonly service: IApplicationService) {}

	@bind
	handle(req: IDeleteApplicationRequest) {
		return this.service.deleteApplication(req)
	}
}