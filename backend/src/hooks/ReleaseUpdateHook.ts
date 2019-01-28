
import { EventType, IPublishVersionRequest, IPublishVersionResponse, SystemType, IAppModel } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/Interfaces'
import { Model } from 'mongoose'
import { toModel } from '../util/util'
import { IVersionDocument } from '../models/Version'

@DI.injectable()
export default class ReleaseUpdateHook implements IPostRespondHook {
	public eventTypes = new Set([EventType.ReleaseUpdate])

	constructor(
		@DI.inject(DI.Mediators.Clients)
		private readonly clientsMediators: Map<string, ISocketMediator>,
		@DI.inject(DI.Models.Version)
		private readonly versions: Model<IVersionDocument>,
	) {}

	@bind
	public async handle(
		_: EventType,
		{ versionId }: IPublishVersionRequest,
		{ isSuccessful }: IPublishVersionResponse,
	) {
		if (isSuccessful) {
			const version = await this.versions
				.findById(versionId)
				.select(`
					versionName
					isBase
					isCritical
					downloadUrl
					description
					hash
					app
					systems
				`)
				.populate('app')
				.then(toModel)

			const clientsMediator = this.clientsMediators.get(version.app.bundleId)
			const update = { ...version, versionId }

			clientsMediator.broadcast(EventType.NewUpdate, update, (client) => {
				const { type } = client.handshake.query
				return Boolean(version.systems[type as SystemType])
			})
		}
	}
}
