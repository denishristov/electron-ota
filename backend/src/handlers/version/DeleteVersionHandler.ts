import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, IDeleteVersionRequest, IDeleteVersionResponse } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IVersionService } from '../../services/VersionService'
import { IHandler } from '../../util/mediator/Interfaces'

@injectable()
export default class DeleteVersionHandler implements IHandler<IDeleteVersionRequest, IDeleteVersionResponse> {
	public readonly eventType: EventType = EventType.DeleteVersion

	@inject(Services.Version)
	private readonly service: IVersionService

	@bind
	public handle() {
		return this.service.deleteVersion(arguments[0])
	}
}
