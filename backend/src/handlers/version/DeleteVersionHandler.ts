import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IDeleteVersionRequest, IDeleteVersionResponse } from "shared";
import { IVersionService } from "../../services/VersionService";
import { inject } from "inversify";
import { SERVICES } from "../../dependencies/symbols";
import bind from "bind-decorator";

export default class DeleteVersionHandler implements IHandler<IDeleteVersionRequest, IDeleteVersionResponse> {
	@inject(SERVICES.VERSION)
	private readonly service: IVersionService
	
	readonly eventType: EventType = EventType.DeleteVersion
	
	@bind
	handle() {
		return this.service.deleteVersion(arguments[0])
	}
}