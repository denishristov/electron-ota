import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, ICreateVersionRequest, ICreateVersionResponse } from "shared";
import { IVersionService } from "../../services/VersionService";

export default class CreateVersionHandler implements IHandler<ICreateVersionRequest, ICreateVersionResponse> {
	readonly eventType: EventType = EventType.CreateVersion
	
	constructor(private readonly service: IVersionService) {}

	handle(req: ICreateVersionRequest) {
		return this.service.createVersion(req)
	}
}