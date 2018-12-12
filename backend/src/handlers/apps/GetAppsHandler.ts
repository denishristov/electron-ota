import { IHandler } from "../../util/mediator/Interfaces"
import { IRequest, IUpdateAppRequest, IUpdateAppResponse, EventType } from "shared";
import { IAppService } from '../../services/AppService'
import bind from "bind-decorator";

export default class GetAppsHandler implements IHandler<IRequest, object> {
	readonly eventType: EventType = EventType.GetApps
	
	constructor(private readonly service: IAppService) {}

	handle(req: IRequest) {
		return this.service.getApps()
	}
}