import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, ICreateAppRequest, ICreateAppResponse } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IAppService } from '../../services/AppService'
import { IHandler } from '../../util/mediator/Interfaces'

@injectable()
export default class CreateAppHandler implements IHandler<ICreateAppRequest, ICreateAppResponse> {
	public readonly eventType: EventType = EventType.CreateApp

	@inject(Services.App)
	private readonly service: IAppService

	@bind
	public handle() {
		return this.service.createApp(arguments[0])
	}
}
