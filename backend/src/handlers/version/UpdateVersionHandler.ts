import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, IUpdateVersionRequest, IUpdateVersionResponse } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IVersionService } from '../../services/VersionService'
import { IHandler } from '../../util/mediator/Interfaces'

@injectable()
export default class UpdateVersionHandler implements IHandler<IUpdateVersionRequest, IUpdateVersionResponse> {
	public readonly eventType: EventType = EventType.UpdateVersion

	@inject(Services.Version)
	private readonly service: IVersionService

	@bind
	public handle() {
		return this.service.createVersion(arguments[0])
	}
}
