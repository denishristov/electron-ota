import { IPostRespondHook } from '../mediator/Interfaces'
import { EventType, ICreateAppRequest, ICreateAppResponse } from 'shared'
import { UpdateClientsMediatorFactory } from '../mediator/MediatorFactory'

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
