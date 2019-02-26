import { EventType, CreateAppRequest, CreateAppResponse, SystemType } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'
import { ClientsMediatorFactory } from '../mediators/ClientsMediatorFactory'

export interface ICreateClientMediatorHook extends IPostRespondHook {
	handle(event: EventType, req: CreateAppRequest, res: CreateAppResponse): Promise<void>
}

@DI.injectable()
export default class CreateClientMediatorHook implements IPostRespondHook {
	public readonly eventTypes = new Set([EventType.CreateApp])

	constructor(
		@DI.inject(DI.Factories.ClientsMediator)
		private readonly clientMediatorFactory: ClientsMediatorFactory,
		@DI.inject(DI.Mediators)
		private readonly mediators: Map<string, ISocketMediator>,
	) {}

	@bind
	public async handle(eventType: EventType, { bundleId }: CreateAppRequest) {
		for (const systemType of Object.keys(SystemType) as SystemType[]) {
			const mediator = this.clientMediatorFactory(bundleId, systemType)
			this.mediators.set(mediator.name, mediator)
		}
	}
}
