import { interfaces } from 'inversify'
import { IAppModel, EventType } from 'shared'
import { ISocketMediator } from '../../util/mediator/Interfaces'
import SocketMediator from '../../util/mediator/Mediator'
import { IReleaseService } from '../../services/UpdateService'
import { IClientService } from '../../services/ClientService'
import { IVersionStatisticsService } from '../../services/VersionStatisticsService'
import { IPostRespondHook } from '../../util/mediator/interfaces'

export type ClientsMediatorFactory = (bundleId: string) => ISocketMediator

export default function clientsMediatorFactory({ container }: interfaces.Context): ClientsMediatorFactory {
	const server = container.get<SocketIO.Server>(DI.SocketServer)

	const updateService = container.get<IReleaseService>(DI.Services.Update)
	const clientService = container.get<IClientService>(DI.Services.Client)
	const statisticsService = container.get<IVersionStatisticsService>(DI.Services.VersionStatistics)

	return (bundleId: string) => {
		const reportHook = container.get<IPostRespondHook>(DI.Hooks.Report)

		const namespaceName = `/${bundleId}`

		const mediator = new SocketMediator(server.of(namespaceName))

		mediator.usePostRespond(reportHook)

		mediator.use({
			[EventType.CheckForUpdate]: updateService.checkForUpdate,
			[EventType.RegisterClient]: clientService.registerClient,

			[EventType.UpdateDownloading]: statisticsService.downloadingUpdate,
			[EventType.UpdateDownloaded]: statisticsService.downloadedUpdate,
			[EventType.UpdateUsing]: statisticsService.usingUpdate,
			[EventType.UpdateError]: statisticsService.error,
		})

		return mediator
	}
}
