import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, ICreateVersionRequest, ICreateVersionResponse } from "shared";
import { IVersionService } from "../../services/VersionService";
import { inject } from "inversify";
import { SERVICES } from "../../dependencies/symbols";
import bind from "bind-decorator";

export default class CreateVersionHandler implements IHandler<ICreateVersionRequest, ICreateVersionResponse> {
	@inject(SERVICES.VERSION)
	private readonly service: IVersionService
	
	readonly eventType: EventType = EventType.CreateVersion
	
	@bind
	handle() {
		return this.service.createVersion(arguments[0])
	}
}