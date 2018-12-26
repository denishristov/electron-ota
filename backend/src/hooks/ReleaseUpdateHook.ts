import { IPostRespondHook, IMediator } from '../mediator/Interfaces'
import { EventType, IPublishVersionRequest, IPublishVersionResponse } from 'shared'
import { IVersionService } from '../services/VersionService'

export default class ReleaseUpdateHook implements IPostRespondHook {
	public eventTypes = new Set([EventType.PublishVersion])

	constructor(
		private readonly clientsMediator: IMediator,
		private readonly versionService: IVersionService,
	) {}

	@bind
	public async handle(
		{ id }: IPublishVersionRequest,
		{ isSuccessful }: IPublishVersionResponse,
	) {
		if (isSuccessful) {
			const {
				isBase,
				isCritical,
				downloadUrl,
				description,
			} = await this.versionService.getVersion({ id })

			const update = {
				isBase,
				isCritical,
				downloadUrl,
				description,
			}

			this.clientsMediator.broadcast(EventType.NewUpdate, update)
		}
	}
}
