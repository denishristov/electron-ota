import { IHandler } from "../../util/mediator/Interfaces"
import { IRequest, IUpdateAppRequest, IUpdateAppResponse, EventType, IGetAppsRequest, IGetAppsResponse } from "shared";
import { IAppService } from '../../services/AppService'
import bind from "bind-decorator";
import { inject, injectable } from "inversify";
import { Services } from "../../dependencies/symbols";

@injectable()
export default class GetAppsHandler implements IHandler<IGetAppsRequest, IGetAppsResponse> {
	@inject(Services.App)
	private readonly service: IAppService

	readonly eventType: EventType = EventType.GetApps

	@bind
	handle() {
		return this.service.getApps()
	}
}