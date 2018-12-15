import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IGetVersionsRequest, IGetVersionsResponse } from "shared";
import { IVersionService } from "../../services/VersionService";
import { inject, injectable } from "inversify";
import { Services } from "../../dependencies/symbols";
import bind from "bind-decorator";

@injectable()
export default class GetVersionsHandler implements IHandler<IGetVersionsRequest, IGetVersionsResponse> {
	@inject(Services.Version)
	private readonly service: IVersionService
	
	readonly eventType: EventType = EventType.GetVersions
	
	@bind
	handle() {
		return this.service.getVersions(arguments[0])
	}
}