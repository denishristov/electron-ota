import { interfaces } from 'inversify'
import { IAppModel, EventType } from 'shared'
import { ReleaseUpdateHookFactory } from './ReleaseUpdateHookFactory'
import { ISocketMediator } from '../../util/mediator/Interfaces'
import SocketMediator from '../../util/mediator/Mediator'
import { IReleaseService } from '../../services/UpdateService'
import { IClientService } from '../../services/ClientService'
import { IVersionStatisticsService } from '../../services/VersionStatisticsService'

export type UpdateClientsMediatorFactory = (app: IAppModel) => ISocketMediator

export default function updateClientsMediatorFactory({ container }: interfaces.Context): UpdateClientsMediatorFactory {
	const server = container.get<SocketIO.Server>(DI.SocketServer)
	const updateService = container.get<IReleaseService>(DI.Services.Update)
	const releaseUpdateHookFactory = container.get<ReleaseUpdateHookFactory>(DI.Factories.ReleaseUpdateHook)
	const clientService = container.get<IClientService>(DI.Services.Client)
	const statisticsService = container.get<IVersionStatisticsService>(DI.Services.VersionStatistics)

	return (app: IAppModel) => {
		const namespaceName = `/${app.bundleId}`
		const adminMediator = container.get<ISocketMediator>(DI.Mediators.Admins)

		const mediator = new SocketMediator(server.of(namespaceName))

		const releaseUpdateHook = releaseUpdateHookFactory(mediator)

		adminMediator.usePostRespond(releaseUpdateHook)

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
