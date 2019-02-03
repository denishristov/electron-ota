import { EventType, CreateAppRequest, CreateAppResponse, SystemType } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'
import { ClientsMediatorFactory } from '../dependencies/factories/ClientsMediatorFactory'

@DI.injectable()
export default class CreateUpdateClientsMediator implements IPostRespondHook {
	private static readonly systemTypes = Object.keys(SystemType) as SystemType[]
	public readonly eventTypes = new Set([EventType.CreateApp])

	constructor(
		@DI.inject(DI.Factories.ClientsMediator)
		private readonly clientMediatorFactory: ClientsMediatorFactory,
		@DI.inject(DI.Mediators)
		private readonly mediators: Map<string, ISocketMediator>,
	) {}

	public async handle(_: EventType, req: CreateAppRequest, app: CreateAppResponse) {
		for (const systemType of CreateUpdateClientsMediator.systemTypes) {
			const mediator = this.clientMediatorFactory(app.bundleId, systemType)

			this.mediators.set(mediator.name, mediator)
		}
	}
}
