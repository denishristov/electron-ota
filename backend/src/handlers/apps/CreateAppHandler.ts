import { IHandler } from "../../util/mediator/Interfaces"
import { ICreateAppRequest, ICreateAppResponse, EventType } from "shared";
import { IAppService } from '../../services/AppService'
import bind from "bind-decorator";
import { inject } from "inversify";
import { SERVICES } from "../../dependencies/symbols";

export default class CreateAppHandler implements IHandler<ICreateAppRequest, ICreateAppResponse> {
	@inject(SERVICES.APP)
	private readonly service: IAppService
	
	readonly eventType: EventType = EventType.CreateApp

	@bind
	handle() {
		return this.service.createApp(arguments[0])
	}
}