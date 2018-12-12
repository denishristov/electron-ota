import { IHandler } from "../../util/mediator/Interfaces"
import { IUpdateAppRequest, IUpdateAppResponse, EventType } from "shared";
import { IAppService } from '../../services/AppService'

export default class UpdateAppHandler implements IHandler<IUpdateAppRequest, IUpdateAppResponse> {
	readonly eventType: EventType = EventType.UpdateApp
	
	constructor(private readonly service: IAppService) {}

	handle(req: IUpdateAppRequest) {
		return this.service.updateApp(req)
	}
}