import { IHandler } from "../../util/mediator/Interfaces"
import { IUpdateAppRequest, IUpdateAppResponse, EventType } from "shared";
import { IAppService } from '../../services/AppService'
import { inject, injectable } from "inversify";
import { Services } from "../../dependencies/symbols";
import bind from "bind-decorator";

@injectable()
export default class UpdateAppHandler implements IHandler<IUpdateAppRequest, IUpdateAppResponse> {
	@inject(Services.App)
	private readonly service: IAppService
	
	readonly eventType: EventType = EventType.UpdateApp
	
	@bind
	handle() {
		return this.service.updateApp(arguments[0])
	}
}