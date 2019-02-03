import { EventType, CreateAppRequest, CreateAppResponse } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'
import { ClientsMediatorFactory } from '../dependencies/factories/ClientsMediatorFactory'

@DI.injectable()
export default class CreateUpdateClientsMediator implements IPostRespondHook {
	public readonly eventTypes = new Set([EventType.CreateApp])

	constructor(
		@DI.inject(DI.Factories.ClientsMediator)
		private readonly clientMediatorFactory: ClientsMediatorFactory,
		@DI.inject(DI.Mediators.Clients)
		private readonly clients: Map<string, ISocketMediator>,
	) {}

	public async handle(_: EventType, req: CreateAppRequest, app: CreateAppResponse) {
		const mediator = this.clientMediatorFactory(app.bundleId)
		this.clients.set(app.bundleId, mediator)
	}
}
