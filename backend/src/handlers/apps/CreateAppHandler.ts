import { IHandler } from "../../util/mediator/Interfaces"
import { ICreateAppRequest, ICreateAppResponse, EventType } from "shared";
import { IAppService } from '../../services/AppService'
import bind from "bind-decorator";

export default class CreateAppHandler implements IHandler<ICreateAppRequest, ICreateAppResponse> {
	readonly eventType: EventType = EventType.CreateApp
	
	constructor(private readonly service: IAppService) {}

	handle(req: ICreateAppRequest) {
		return this.service.createApp(req)
	}
}