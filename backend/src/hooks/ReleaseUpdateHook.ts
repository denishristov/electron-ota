
import { EventType, PublishVersionRequest, PublishVersionResponse, SystemType } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'
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
		{ versionId }: PublishVersionRequest,
		{ isSuccessful }: PublishVersionResponse,
	) {
		if (isSuccessful) {
			const { app, ...version } = await this.versions
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

			const clientsMediator = this.clientsMediators.get(app.bundleId)
			const update = { ...version, versionId }

			clientsMediator.broadcast(EventType.NewUpdate, update, (client) => {
				const { type } = client.handshake.query
				return Boolean(version.systems[type as SystemType])
			})
		}
	}
}
