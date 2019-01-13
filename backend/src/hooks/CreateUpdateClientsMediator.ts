import { EventType, ICreateAppRequest, ICreateAppResponse } from 'shared'
import { IPostRespondHook } from '../util/mediator/Interfaces'
import { UpdateClientsMediatorFactory } from '../dependencies/factories/UpdateClientsMediatorFactory'

@DI.injectable()
export default class CreateUpdateClientsMediator implements IPostRespondHook {
	public readonly eventTypes = new Set([EventType.CreateApp])

	constructor(
		@DI.inject(DI.Factories.ClientsMediator)
		private readonly clientMediatorFactory: UpdateClientsMediatorFactory,
	) {}

	public async handle(req: ICreateAppRequest, app: ICreateAppResponse) {
		this.clientMediatorFactory(app)
	}
}
