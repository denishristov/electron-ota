import { interfaces } from 'inversify'
import { IAppModel, EventType } from 'shared'
import { ISocketMediator } from '../../util/mediator/Interfaces'
import SocketMediator from '../../util/mediator/Mediator'
import { IReleaseService } from '../../services/UpdateService'
import { IClientService } from '../../services/ClientService'
import { IVersionReportsService } from '../../services/VersionReportsService'
import { IPostRespondHook } from '../../util/mediator/interfaces'

export type ClientsMediatorFactory = (bundleId: string) => ISocketMediator

export default function clientsMediatorFactory({ container }: interfaces.Context): ClientsMediatorFactory {
	const server = container.get<SocketIO.Server>(DI.SocketServer)

	const updateService = container.get<IReleaseService>(DI.Services.Update)
	const clientService = container.get<IClientService>(DI.Services.Client)
	const ReportsService = container.get<IVersionReportsService>(DI.Services.VersionReports)

	return (bundleId: string) => {
		const reportHook = container.get<IPostRespondHook>(DI.Hooks.Report)

		const namespaceName = `/${bundleId}`

		const mediator = new SocketMediator(server.of(namespaceName))

		mediator.usePostRespond(reportHook)

		mediator.use({
			[EventType.CheckForUpdate]: updateService.checkForUpdate,
			[EventType.RegisterClient]: clientService.registerClient,

			[EventType.UpdateDownloading]: ReportsService.downloadingUpdate,
			[EventType.UpdateDownloaded]: ReportsService.downloadedUpdate,
			[EventType.UpdateUsing]: ReportsService.usingUpdate,
			[EventType.UpdateError]: ReportsService.error,
		})

		return mediator
	}
}
