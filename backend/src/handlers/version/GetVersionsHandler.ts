import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IGetVersionsRequest, IGetVersionsResponse } from "shared";
import { IVersionService } from "../../services/VersionService";

export default class GetVersionsHandler implements IHandler<IGetVersionsRequest, IGetVersionsResponse> {
	readonly eventType: EventType = EventType.GetVersions
	
	constructor(private readonly service: IVersionService) {}

	handle(req: IGetVersionsRequest) {
		return this.service.getVersions(req)
	}
}