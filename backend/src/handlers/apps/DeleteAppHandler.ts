import { IHandler } from "../../util/mediator/Interfaces"
import { IDeleteAppRequest, IDeleteAppResponse, EventType } from "shared";
import { IAppService } from '../../services/AppService'
import { inject } from "inversify";
import { SERVICES } from "../../dependencies/symbols";
import bind from "bind-decorator";

export default class DeleteAppHandler implements IHandler<IDeleteAppRequest, IDeleteAppResponse> {
	@inject(SERVICES.APP)
	private readonly service: IAppService
	
	readonly eventType: EventType = EventType.DeleteApp

	@bind
	handle() {
		return this.service.deleteApp(arguments[0])
	}
}