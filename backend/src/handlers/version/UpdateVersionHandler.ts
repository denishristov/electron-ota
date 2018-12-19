import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IUpdateVersionRequest, IUpdateVersionResponse } from "shared";
import { IVersionService } from "../../services/VersionService";
import { inject, injectable } from "inversify";
import { Services } from "../../dependencies/symbols";
import bind from "bind-decorator";

@injectable()
export default class UpdateVersionHandler implements IHandler<IUpdateVersionRequest, IUpdateVersionResponse> {
	@inject(Services.Version)
	private readonly service: IVersionService
	
	readonly eventType: EventType = EventType.UpdateVersion
	
	@bind
	handle() {
		return this.service.createVersion(arguments[0])
	}
}