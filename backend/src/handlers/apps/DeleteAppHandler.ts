import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, IDeleteAppRequest, IDeleteAppResponse } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IAppService } from '../../services/AppService'
import { IHandler } from '../../util/mediator/Interfaces'

@injectable()
export default class DeleteAppHandler implements IHandler<IDeleteAppRequest, IDeleteAppResponse> {
	public readonly eventType: EventType = EventType.DeleteApp

	@inject(Services.App)
	private readonly service: IAppService

	@bind
	public handle() {
		return this.service.deleteApp(arguments[0])
	}
}
