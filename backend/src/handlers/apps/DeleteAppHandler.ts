import { IHandler } from "../../util/mediator/Interfaces"
import { IRequest, IDeleteAppRequest, IDeleteAppResponse, EventType } from "shared";
import { IAppService } from '../../services/AppService'
import bind from "bind-decorator";

export default class DeleteAppHandler implements IHandler<IDeleteAppRequest, IDeleteAppResponse> {
	readonly eventType: EventType = EventType.DeleteApp
	
	constructor(private readonly service: IAppService) {}

	handle(req: IDeleteAppRequest) {
		return this.service.deleteApp(req)
	}
}