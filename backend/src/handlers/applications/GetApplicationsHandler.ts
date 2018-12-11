import { IHandler } from "../Interfaces"
import { IRequest, IUpdateApplicationRequest, IUpdateApplicationResponse } from "shared";
import { IApplicationService } from '../../services/ApplicationService'
import bind from "bind-decorator";

export default class UpdateApplicationHandler implements IHandler<IUpdateApplicationRequest, IUpdateApplicationResponse> {
	constructor(readonly eventType: string, private readonly service: IApplicationService) {}

	@bind
	handle(req: IUpdateApplicationRequest) {
		return this.service.updateApplication(req)
	}
}