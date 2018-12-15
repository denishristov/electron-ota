import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IGetVersionsRequest, IGetVersionsResponse } from "shared";
import { IVersionService } from "../../services/VersionService";
import { inject } from "inversify";
import { SERVICES } from "../../dependencies/symbols";
import bind from "bind-decorator";

export default class GetVersionsHandler implements IHandler<IGetVersionsRequest, IGetVersionsResponse> {
	@inject(SERVICES.VERSION)
	private readonly service: IVersionService
	
	readonly eventType: EventType = EventType.GetVersions
	
	@bind
	handle() {
		return this.service.getVersions(arguments[0])
	}
}