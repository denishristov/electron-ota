
import { EventType, IPublishVersionRequest, IPublishVersionResponse, SystemType, IAppModel } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/Interfaces'
import { Model } from 'mongoose'
import { toModel } from '../util/util'
import { IVersionDocument } from '../models/Version'

export default class ReleaseUpdateHook implements IPostRespondHook {
	public eventTypes = new Set([EventType.ReleaseUpdate])

	constructor(
		private readonly clientsMediator: ISocketMediator,
		private readonly versions: Model<IVersionDocument>,
		private readonly app: IAppModel,
	) {}

	@bind
	public async handle(
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

			if (version.app.id === this.app.id) {
				const update = { ... toModel(version), versionId }

				this.clientsMediator.broadcast(EventType.NewUpdate, update, (client) => {
					const { type } = client.handshake.query
					return Boolean(version.systems[type as SystemType])
				})
			}
		}
	}
}
