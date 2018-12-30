import { IPostRespondHook, ISocketMediator } from '../mediator/Interfaces'
import { EventType, ICreateAppRequest, ICreateAppResponse } from 'shared'
import { IMediatorFactory } from '../mediator/MediatorFactory'

export default class CreateUpdateClientsMediator implements IPostRespondHook {
	public readonly eventTypes = new Set([EventType.CreateApp])

	constructor(
		@DI.inject(DI.Factories.Mediator) private readonly mediatorFactory: IMediatorFactory,
		@DI.inject(DI.Mediators.Admins) private readonly adminsMediator: ISocketMediator,
	) {}

	public async handle(req: ICreateAppRequest, app: ICreateAppResponse) {
		this.mediatorFactory.createUpdateClientsMediator(this.adminsMediator, app)
	}
}
