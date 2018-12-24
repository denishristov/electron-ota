import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, IPublishVersionRequest, IPublishVersionResponse } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IVersionService } from '../../services/VersionService'
import { IHandler } from '../../util/mediator/Interfaces'
import { IAppService } from '../../services/AppService'

@injectable()
export default class PublishVersionHandler implements IHandler<IPublishVersionRequest, IPublishVersionResponse> {
	public readonly eventType: EventType = EventType.PublishVersion

	constructor(
		@inject(Services.Version) private readonly versionService: IVersionService,
		@inject(Services.App) private readonly appService: IAppService,
	) {}

	@bind
	public async handle(req: IPublishVersionRequest): Promise<IPublishVersionResponse> {
		try {
			await this.versionService.updateVersion({ ...req, isPublished: true })
			await this.appService.updateApp({ id: req.appId, latestVersion: req.id })

			return {
				isSuccessful: true,
			}
		} catch (error) {
			return {
				isSuccessful: false,
				errorMessage: error.message,
			}
		}
	}
}
