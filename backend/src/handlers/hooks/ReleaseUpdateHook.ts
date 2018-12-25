import { IPostRespondHook, IClient } from '../../util/mediator/Interfaces'
import { EventType, IPublishVersionRequest, IPublishVersionResponse } from 'shared'
import bind from 'bind-decorator'
import { inject } from 'inversify'
import { Services } from '../../dependencies/symbols'
import { IVersionService } from '../../services/VersionService'

export default class ReleaseUpdateHook implements IPostRespondHook {
	public eventTypes = [EventType.PublishVersion]

	constructor(
		private readonly clients: SocketIO.Namespace,
		@inject(Services.Version) private readonly versionService: IVersionService,
	) {}

	@bind
	public async handle(
		event: EventType,
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

			this.clients.in('darwin').emit(EventType.NewUpdate, update)
		}
	}
}
