import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IUpdateVersionRequest, IUpdateVersionResponse } from "shared";
import { IVersionService } from "../../services/VersionService";
import { inject } from "inversify";
import { SERVICES } from "../../dependencies/symbols";
import bind from "bind-decorator";

export default class UpdateVersionHandler implements IHandler<IUpdateVersionRequest, IUpdateVersionResponse> {
	@inject(SERVICES.VERSION)
	private readonly service: IVersionService
	
	readonly eventType: EventType = EventType.CreateVersion
	
	@bind
	handle() {
		return this.service.createVersion(arguments[0])
	}
}