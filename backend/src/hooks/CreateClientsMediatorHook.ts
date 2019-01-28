import { EventType, ICreateAppRequest, ICreateAppResponse } from 'shared'
import { IPostRespondHook } from '../util/mediator/Interfaces'
import { ClientsMediatorFactory } from '../dependencies/factories/ClientsMediatorFactory'

@DI.injectable()
export default class CreateUpdateClientsMediator implements IPostRespondHook {
	public readonly eventTypes = new Set([EventType.CreateApp])

	constructor(
		@DI.inject(DI.Factories.ClientsMediator)
		private readonly clientMediatorFactory: ClientsMediatorFactory,
	) {}

	public async handle(_: EventType, req: ICreateAppRequest, app: ICreateAppResponse) {
		this.clientMediatorFactory(app.bundleId)
	}
}
