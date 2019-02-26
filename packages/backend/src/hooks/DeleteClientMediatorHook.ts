import { EventType, SystemType, DeleteAppRequest, DeleteAppResponse } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'
import { ClientsMediatorFactory } from '../mediators/ClientsMediatorFactory'
import { App } from '../models/App'
import { ModelType } from 'typegoose'

export interface IDeleteClientMediatorHook extends IPostRespondHook {
	handle(
		event: EventType,
		req: DeleteAppRequest,
		res: DeleteAppResponse,
	): Promise<void>
}

@DI.injectable()
export default class DeleteClientMediatorHook implements IPostRespondHook {
	public readonly eventTypes = new Set([EventType.DeleteApp])

	constructor(
		@DI.inject(DI.Factories.ClientsMediator)
		private readonly clientMediatorFactory: ClientsMediatorFactory,
		@DI.inject(DI.Mediators)
		private readonly mediators: Map<string, ISocketMediator>,
		@DI.inject(DI.Models.App)
		private readonly AppModel: ModelType<App>,
	) {}

	@bind
	public async handle(eventType: EventType, { id }: DeleteAppRequest) {
		const { bundleId } = await this.AppModel.findById(id).select('bundleId')

		for (const systemType of Object.keys(SystemType) as SystemType[]) {
			const mediator = this.clientMediatorFactory(bundleId, systemType)
			mediator.dispose()

			this.mediators.delete(mediator.name)
		}
	}
}
