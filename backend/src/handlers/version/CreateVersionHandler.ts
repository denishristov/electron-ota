import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, ICreateVersionRequest, ICreateVersionResponse } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IVersionService } from '../../services/VersionService'
import { IHandler } from '../../util/mediator/Interfaces'

@injectable()
export default class CreateVersionHandler implements IHandler<ICreateVersionRequest, ICreateVersionResponse> {
	public readonly eventType: EventType = EventType.CreateVersion

	@inject(Services.Version)
	private readonly service: IVersionService

	@bind
	public handle() {
		return this.service.createVersion(arguments[0])
	}
}
