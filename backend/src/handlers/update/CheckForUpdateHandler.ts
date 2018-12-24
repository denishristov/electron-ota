import { injectable, inject } from 'inversify'
import { EventType, ICheckForUpdateRequest, ICheckForUpdateResponse } from 'shared'
import { IHandler } from '../../util/mediator/Interfaces'
import { Handlers } from '../../dependencies/symbols'
import { IAppUpdateService } from '../../services/AppUpdateService'

@injectable()
export default class CheckForUpdateHandler implements IHandler<ICheckForUpdateRequest, ICheckForUpdateResponse> {
	public readonly eventType = EventType.CheckForUpdate

	constructor(
		@inject(Handlers.Update.Check) private readonly appUpdateService: IAppUpdateService,
	) {}

	public handle(req: ICheckForUpdateRequest) {
		return this.appUpdateService.checkForUpdate(req)
	}
}
