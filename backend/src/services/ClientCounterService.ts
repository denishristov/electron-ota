import { ISocketMediator, IClient  } from '../util/mediator/interfaces'
import { SystemType, EventType, IAppsClientCount, IAppClientCount, GetAppCountersRequest } from 'shared'
import { AdminMediatorPath } from '../util/symbols'

export interface IClientCounterService {
	getAppsClientsCount(): IAppsClientCount
	getAppClientsCount({ bundleId }: GetAppCountersRequest): IAppClientCount
	handleClientConnection(client: IClient): void
	handleClientDisconnection(client: IClient): void
}

const defaultSystemTypeCounters = Object.keys(SystemType).group((x) => [x, 0])
const clientMediatorRegex = /\/([\w\.-]+)\/(\w+)/

@injectable()
export default class ClientCounterService implements IClientCounterService {
	public readonly handleClientConnection = this.createClientHandler(EventType.ClientConnected)

	public readonly handleClientDisconnection = this.createClientHandler(EventType.ClientDisconnected)

	constructor(
		@inject(nameof<Map<string, ISocketMediator>>())
		private readonly mediators: Map<string, ISocketMediator>,
	) {}

	@bind
	public getAppsClientsCount() {
		const response: IAppsClientCount = {}

		for (const [name, mediator] of this.mediators.entries()) {
			const match = name.match(clientMediatorRegex)

			if (match) {
				const [_, bundleId, systemType] = match

				response[bundleId] = response[bundleId] || {}
				response[bundleId][systemType] = mediator.clients.length
			}
		}

		return response
	}

	@bind
	public getAppClientsCount({ bundleId }: GetAppCountersRequest) {
		const response: IAppClientCount = {}

		for (const systemType of Object.values(SystemType)) {
			const mediator = this.mediators.get(`/${bundleId}/${systemType}`)

			for (const client of mediator.clients) {
				const { versionName } = client.handshake.query

				response[versionName] = response[versionName] || { ... defaultSystemTypeCounters }
				response[versionName][systemType] = response[versionName][systemType]
					? ++response[versionName][systemType]
					: 1
			}
		}

		return response
	}

	private createClientHandler(eventType: EventType) {
		return (client: IClient) => {
			const { versionName } = client.handshake.query
			const [_, bundleId, systemType] = client.nsp.name.match(clientMediatorRegex)

			this.mediators.get(AdminMediatorPath).broadcast(eventType, {
				bundleId,
				versionName,
				systemType,
			})
		}
	}
}
