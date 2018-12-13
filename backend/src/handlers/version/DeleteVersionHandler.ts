import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IDeleteVersionRequest, IDeleteVersionResponse } from "shared";
import { IVersionService } from "../../services/VersionService";

export default class DeleteVersionHandler implements IHandler<IDeleteVersionRequest, IDeleteVersionResponse> {
	readonly eventType: EventType = EventType.DeleteVersion
	
	constructor(private readonly service: IVersionService) {}

	handle(req: IDeleteVersionRequest) {
		return this.service.deleteVersion(req)
	}
}