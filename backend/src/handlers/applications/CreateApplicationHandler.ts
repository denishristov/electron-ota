import { IHandler } from "../Interfaces"
import { IRequest, ICreateApplicationRequest, ICreateApplicationResponse } from "shared";
import { IApplicationService } from '../../services/ApplicationService'
import bind from "bind-decorator";

export default class CreateApplicationHandler implements IHandler<ICreateApplicationRequest, ICreateApplicationResponse> {
	constructor(
		readonly eventType: string, 
		private readonly service: IApplicationService
	) {}

	@bind
	handle(req: ICreateApplicationRequest) {
		return this.service.createApplication(req)
	}
}