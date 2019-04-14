
import { EventType, PublishVersionRequest, PublishVersionResponse } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'
import { Version } from '../models/Version'
import { ModelType } from 'typegoose'
import { App } from '../models/App'

export interface IReleaseUpdateHook extends IPostRespondHook {
	handle(eventType: EventType, req: PublishVersionRequest, res: PublishVersionResponse): Promise<void>
}

@injectable()
export default class ReleaseUpdateHook implements IReleaseUpdateHook {
	public eventTypes = new Set([EventType.ReleaseUpdate])

	constructor(
		@inject(nameof<Map<string, ISocketMediator>>())
		private readonly mediators: Map<string, ISocketMediator>,
		@inject(nameof<Version>())
		private readonly VersionModel: ModelType<Version>,
		@inject(nameof<App>())
		private readonly AppModel: ModelType<App>,
	) {}

	@bind
	public async handle(
		_: EventType,
		{ versionId }: PublishVersionRequest,
		res: PublishVersionResponse,
	) {
		const { appId, ...version } = await this.VersionModel
			.findById(versionId)
			.select(`
				versionName
				isBase
				isCritical
				downloadUrl
				description
				hash
				appId
				systems
			`)
			.then((version) => version.toJSON())

		const { bundleId } = await this.AppModel.findById(appId).select('bundleId')

		const update = { ...version, versionId }
		const supportedSystemTypes = Object.entries(version.systems)
			.filter(([_, value]) => value)
			.map(([systemType, _]) => systemType)

		for (const systemType of supportedSystemTypes) {
			const name = `/${bundleId}/${systemType}`
			const mediator = this.mediators.get(name)

			if (!mediator) {
				throw new Error(`mediator ${name} does not exist`)
			}

			mediator.broadcast(EventType.NewUpdate, update)
		}
	}
}
