import { IPostRespondHook, ISocketMediator } from '../mediator/Interfaces'
import { EventType, IPublishVersionRequest, IPublishVersionResponse } from 'shared'
import { IVersionService } from '../services/VersionService'

export type ReleaseUpdateHookFactory = (clientsMediator: ISocketMediator) => ReleaseUpdateHook

export default class ReleaseUpdateHook implements IPostRespondHook {
	public eventTypes = new Set([EventType.PublishVersion])

	constructor(
		private readonly clientsMediator: ISocketMediator,
		private readonly versionService: IVersionService,
	) {}

	@bind
	public async handle(
		{ id, appId }: IPublishVersionRequest,
		{ isSuccessful }: IPublishVersionResponse,
	) {
		if (isSuccessful) {
			const {
				versionName,
				isBase,
				isCritical,
				downloadUrl,
				description,
				hash,
			} = await this.versionService.getVersion({ id, appId })

			const update = {
				versionName,
				isBase,
				isCritical,
				downloadUrl,
				description,
				hash,
			}

			this.clientsMediator.broadcast(EventType.NewUpdate, update)
		}
	}
}
