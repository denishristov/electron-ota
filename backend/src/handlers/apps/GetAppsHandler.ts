import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, IGetAppsRequest, IGetAppsResponse, IRequest, IUpdateAppRequest, IUpdateAppResponse } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IAppService } from '../../services/AppService'
import { IHandler } from '../../util/mediator/Interfaces'

@injectable()
export default class GetAppsHandler implements IHandler<IGetAppsRequest, IGetAppsResponse> {

	public readonly eventType: EventType = EventType.GetApps
	@inject(Services.App)
	private readonly service: IAppService

	@bind
	public handle() {
		return this.service.getApps()
	}
}
