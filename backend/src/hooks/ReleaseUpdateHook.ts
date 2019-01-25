
import { EventType, IPublishVersionRequest, IPublishVersionResponse, SystemType } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/Interfaces'
import { IClientDocument } from '../models/Client'
import { Model } from 'mongoose'
import { plain } from '../util/util'
import { IVersionDocument } from '../models/Version'
import { IAppDocument } from '../models/App'

export default class ReleaseUpdateHook implements IPostRespondHook {
	public eventTypes = new Set([EventType.ReleaseUpdate])

	constructor(
		private readonly clientsMediator: ISocketMediator,
		private readonly versions: Model<IVersionDocument>,
		private readonly app: IAppDocument,
	) {}

	@bind
	public async handle(
		{ versionId }: IPublishVersionRequest,
		{ isSuccessful }: IPublishVersionResponse,
	) {
		if (isSuccessful) {
			const { systems, app, ...version } = await this.versions
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
				.then(plain)

			if (app) {

			}

			const update = plain({ ...version, versionId })

			this.clientsMediator.broadcast(EventType.NewUpdate, update, (client) => {
				const { type } = client.handshake.query
				return Boolean(systems[type as SystemType])
			})
		}
	}
}
