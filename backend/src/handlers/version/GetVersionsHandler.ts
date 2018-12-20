import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, IGetVersionsRequest, IGetVersionsResponse } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IVersionService } from '../../services/VersionService'
import { IHandler } from '../../util/mediator/Interfaces'

@injectable()
export default class GetVersionsHandler implements IHandler<IGetVersionsRequest, IGetVersionsResponse> {
	public readonly eventType: EventType = EventType.GetVersions

	@inject(Services.Version)
	private readonly service: IVersionService

	@bind
	public handle() {
		return this.service.getVersions(arguments[0])
	}
}
