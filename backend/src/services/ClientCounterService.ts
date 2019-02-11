import { ISocketMediator, IClient } from '../util/mediator/interfaces'
import { SystemType, EventType } from 'shared'
import { AdminMediator } from '../util/symbols'

interface IAppsClientCount {
	[bundleId: string]: {
		[systemType: string]: number,
	}
}

interface IAppClientCount {
	[versionName: string]: {
		[systemType: string]: number,
	}
}

export interface IClientCounterService {
	getAppsClientsCount(): IAppsClientCount
	getAppClientsCount(bundleId: string): IAppClientCount
	handleClientConnection(client: IClient): void
	handleClientDisconnection(client: IClient): void
}

@DI.injectable()
export default class ClientCounterService implements IClientCounterService {
	private static readonly clientMediatorRegex = /\/([\w-]+)\/(\w+)/

	public readonly handleClientConnection = this.createClientHandler(EventType.ClientConnected)

	public readonly handleClientDisconnection = this.createClientHandler(EventType.ClientDisconnected)

	constructor(
		@DI.inject(DI.Mediators)
		private readonly mediators: Map<string, ISocketMediator>,
	) {}

	@bind
	public getAppsClientsCount() {
		const response: IAppsClientCount = {}

		for (const [name, mediator] of this.mediators.entries()) {
			const match = name.match(ClientCounterService.clientMediatorRegex)

			if (match) {
				const [_, bundleId, systemType] = match

				response[bundleId] = response[bundleId] || {}
				response[bundleId][systemType] = mediator.clients.length
			}
		}

		return response
	}

	@bind
	public getAppClientsCount(bundleId: string) {
		const response: IAppClientCount = {}

		for (const systemType of Object.values(SystemType)) {
			const mediator = this.mediators.get(`/${bundleId}/${systemType}`)

			for (const socket of mediator.clients) {
				const { versionName } = socket.handshake.query

				response[versionName] = response[versionName] || {}
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
			const [_, bundleId, systemType] = client.nsp.name.match(ClientCounterService.clientMediatorRegex)

			this.mediators.get(AdminMediator).broadcast(eventType, {
				bundleId,
				versionName,
				systemType,
			})
		}
	}
}
