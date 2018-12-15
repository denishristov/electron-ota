import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, ICreateVersionRequest, ICreateVersionResponse } from "shared";
import { IVersionService } from "../../services/VersionService";
import { inject, injectable } from "inversify";
import { Services } from "../../dependencies/symbols";
import bind from "bind-decorator";

@injectable()
export default class CreateVersionHandler implements IHandler<ICreateVersionRequest, ICreateVersionResponse> {
	@inject(Services.Version)
	private readonly service: IVersionService
	
	readonly eventType: EventType = EventType.CreateVersion
	
	@bind
	handle() {
		return this.service.createVersion(arguments[0])
	}
}