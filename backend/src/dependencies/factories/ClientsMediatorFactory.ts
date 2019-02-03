import { interfaces } from 'inversify'

import { ISocketMediator, IPostRespondHook } from '../../util/mediator/interfaces'
import SocketMediator from '../../util/mediator/Mediator'
import { Empty } from '../../util/util'

import { IReleaseService } from '../../services/ReleaseService'
import { IClientService } from '../../services/ClientService'
import { IVersionReportsService } from '../../services/VersionReportsService'

import {
	CheckForUpdateRequest,
	CheckForUpdateResponse,
	RegisterClientRequest,
	RegisterClientResponse,
	ClientReportRequest,
	ErrorReportRequest,
	EventType,
} from 'shared'

export type ClientsMediatorFactory = (bundleId: string) => ISocketMediator

export default function clientsMediatorFactory({ container }: interfaces.Context): ClientsMediatorFactory {
	const server = container.get<SocketIO.Server>(DI.SocketServer)

	const updateService = container.get<IReleaseService>(DI.Services.Update)
	const clientService = container.get<IClientService>(DI.Services.Client)
	const ReportsService = container.get<IVersionReportsService>(DI.Services.VersionReports)

	const reportHook = container.get<IPostRespondHook>(DI.Hooks.Report)

	return (bundleId: string) => {
		const namespaceName = `/${bundleId}`

		return new SocketMediator(server.of(namespaceName))
			.use(
				EventType.CheckForUpdate,
				updateService.checkForUpdate,
				CheckForUpdateRequest,
				CheckForUpdateResponse,
			)
			.use(
				EventType.RegisterClient,
				clientService.registerClient,
				RegisterClientRequest,
				RegisterClientResponse,
			)
			.use(
				EventType.UpdateDownloading,
				ReportsService.downloadingUpdate,
				ClientReportRequest,
			)
			.use(
				EventType.UpdateDownloaded,
				ReportsService.downloadedUpdate,
				ClientReportRequest,
			)
			.use(
				EventType.UpdateUsing,
				ReportsService.usingUpdate,
				ClientReportRequest,
			)
			.use(
				EventType.UpdateError,
				ReportsService.error,
				ErrorReportRequest,
			)
			.usePostRespond(reportHook)
	}
}
