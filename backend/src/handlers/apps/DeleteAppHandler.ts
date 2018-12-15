import { IHandler } from "../../util/mediator/Interfaces"
import { IDeleteAppRequest, IDeleteAppResponse, EventType } from "shared";
import { IAppService } from '../../services/AppService'
import { inject, injectable } from "inversify";
import { Services } from "../../dependencies/symbols";
import bind from "bind-decorator";

@injectable()
export default class DeleteAppHandler implements IHandler<IDeleteAppRequest, IDeleteAppResponse> {
	@inject(Services.App)
	private readonly service: IAppService
	
	readonly eventType: EventType = EventType.DeleteApp

	@bind
	handle() {
		return this.service.deleteApp(arguments[0])
	}
}