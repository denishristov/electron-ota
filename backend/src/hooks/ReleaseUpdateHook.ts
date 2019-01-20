
import { EventType, IPublishVersionRequest, IPublishVersionResponse, SystemType } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/Interfaces'
import { IClientDocument } from '../models/Client'
import { Model } from 'mongoose'
import { toPlain } from '../util/util'
import { IVersionDocument } from '../models/Version'

export default class ReleaseUpdateHook implements IPostRespondHook {
	public eventTypes = new Set([EventType.ReleaseUpdate])

	constructor(
		private readonly clientsMediator: ISocketMediator,
		private readonly versions: Model<IVersionDocument>,
		private readonly clients: Model<IClientDocument>,
	) {}

	@bind
	public async handle(
		{ versionId }: IPublishVersionRequest,
		{ isSuccessful }: IPublishVersionResponse,
	) {
		if (isSuccessful) {
			const { systems, ...update } = await this.versions
				.findById(versionId)
				.select(`
					versionName
					isBase
					isCritical
					downloadUrl
					description
					hash
					systems
				`)
				.then(toPlain)

			update.versionId = versionId

			this.clientsMediator.broadcast(EventType.NewUpdate, update, (client) => {
				const { type } = client.handshake.query
				return Boolean(systems[type as SystemType])
			})
		}
	}
}
