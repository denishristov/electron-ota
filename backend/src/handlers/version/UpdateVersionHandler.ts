import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IUpdateVersionRequest, IUpdateVersionResponse } from "shared";
import { IVersionService } from "../../services/VersionService";

export default class UpdateVersionHandler implements IHandler<IUpdateVersionRequest, IUpdateVersionResponse> {
	readonly eventType: EventType = EventType.CreateVersion
	
	constructor(private readonly service: IVersionService) {}

	handle(req: IUpdateVersionRequest) {
		return this.service.updateVersion(req)
	}
}