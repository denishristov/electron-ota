import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IDeleteVersionRequest, IDeleteVersionResponse } from "shared";
import { IVersionService } from "../../services/VersionService";
import { inject, injectable } from "inversify";
import { Services } from "../../dependencies/symbols";
import bind from "bind-decorator";

@injectable()
export default class DeleteVersionHandler implements IHandler<IDeleteVersionRequest, IDeleteVersionResponse> {
	@inject(Services.Version)
	private readonly service: IVersionService
	
	readonly eventType: EventType = EventType.DeleteVersion
	
	@bind
	handle() {
		return this.service.deleteVersion(arguments[0])
	}
}