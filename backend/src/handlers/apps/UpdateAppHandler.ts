import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, IUpdateAppRequest, IUpdateAppResponse } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IAppService } from '../../services/AppService'
import { IHandler } from '../../util/mediator/Interfaces'

@injectable()
export default class UpdateAppHandler implements IHandler<IUpdateAppRequest, IUpdateAppResponse> {
	public readonly eventType: EventType = EventType.UpdateApp

	@inject(Services.App)
	private readonly service: IAppService

	@bind
	public handle() {
		return this.service.updateApp(arguments[0])
	}
}
