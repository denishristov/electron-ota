import { IHandler } from "../../util/mediator/Interfaces"
import { ICreateAppRequest, ICreateAppResponse, EventType } from "shared";
import { IAppService } from '../../services/AppService'
import bind from "bind-decorator";
import { inject, injectable } from "inversify";
import { Services } from "../../dependencies/symbols";

@injectable()
export default class CreateAppHandler implements IHandler<ICreateAppRequest, ICreateAppResponse> {
	@inject(Services.App)
	private readonly service: IAppService
	
	readonly eventType: EventType = EventType.CreateApp

	@bind
	handle() {
		return this.service.createApp(arguments[0])
	}
}