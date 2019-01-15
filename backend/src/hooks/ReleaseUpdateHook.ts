
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
		{ clients, clientCount, systems, versionId }: IPublishVersionRequest,
		{ isSuccessful }: IPublishVersionResponse,
	) {
		if (isSuccessful) {
			const update = await this.versions
				.findById(versionId)
				.select(`
					versionName
					isBase
					isCritical
					downloadUrl
					description
					hash
				`)
				.then(toPlain)

			update.versionId = versionId

			// const clientIds: string[] = []

			if (clients) {
				const clientsSet = new Set(clients)

				this.clientsMediator.broadcast(EventType.NewUpdate, update, (client) => {
					const { type, clientId } = client.handshake.query

					const doesMatch = Boolean(systems[type as SystemType]) && clientsSet.has(clientId)

					if (doesMatch) {
						// clientIds.push(clientId)
					}

					return doesMatch
				}, clientCount && clientCount - clients.length)
			} else {
				this.clientsMediator.broadcast(EventType.NewUpdate, update, (client) => {
					const { type, clientId } = client.handshake.query

					const doesMatch = Boolean(systems[type as SystemType])

					if (doesMatch) {
						// clientIds.push(clientId)
					}

					return doesMatch
				}, clientCount)
			}

			// await this.clients.updateMany(
			// 	{ clientId: { $in: clientIds } },
			// 	{ $set: { updatingVersion: versionId } },
			// 	{ upsert: true },
			// )
		}
	}
}
