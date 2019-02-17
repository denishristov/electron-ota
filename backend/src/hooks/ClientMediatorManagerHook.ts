import { EventType, CreateAppRequest, CreateAppResponse, SystemType } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'
import { ClientsMediatorFactory } from '../mediators/ClientsMediatorFactory'

@DI.injectable()
export default class ClientMediatorManagerHook implements IPostRespondHook {
	private static readonly systemTypes = Object.keys(SystemType) as SystemType[]
	public readonly eventTypes = new Set([EventType.CreateApp, EventType.DeleteApp])

	constructor(
		@DI.inject(DI.Factories.ClientsMediator)
		private readonly clientMediatorFactory: ClientsMediatorFactory,
		@DI.inject(DI.Mediators)
		private readonly mediators: Map<string, ISocketMediator>,
	) {}

	@bind
	public async handle(event: EventType, req: CreateAppRequest, app: CreateAppResponse) {
		for (const systemType of ClientMediatorManagerHook.systemTypes) {
			const mediator = this.clientMediatorFactory(app.bundleId, systemType)

			switch (event) {
				case EventType.CreateApp:
					this.mediators.set(mediator.name, mediator)
					break

				case EventType.DeleteApp:
					this.mediators.delete(mediator.name)
					break
			}
		}
	}
}
