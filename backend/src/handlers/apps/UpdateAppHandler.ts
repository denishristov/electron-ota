import { IHandler } from "../../util/mediator/Interfaces"
import { IUpdateAppRequest, IUpdateAppResponse, EventType } from "shared";
import { IAppService } from '../../services/AppService'
import { inject } from "inversify";
import { SERVICES } from "../../dependencies/symbols";
import bind from "bind-decorator";

export default class UpdateAppHandler implements IHandler<IUpdateAppRequest, IUpdateAppResponse> {
	@inject(SERVICES.APP)
	private readonly service: IAppService
	
	readonly eventType: EventType = EventType.UpdateApp
	
	@bind
	handle() {
		return this.service.updateApp(arguments[0])
	}
}