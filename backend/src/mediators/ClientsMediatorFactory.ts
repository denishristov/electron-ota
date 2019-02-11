import { interfaces } from 'inversify'

import { ISocketMediator, IPostRespondHook, IPreRespondHook } from '../util/mediator/interfaces'
import SocketMediator from '../util/mediator/SocketMediator'

import { IReleaseService } from '../services/ReleaseService'
import { IClientService } from '../services/ClientService'
import { IVersionReportsService } from '../services/VersionReportsService'
import { IClientCounterService } from '../services/ClientCounterService'

import {
	CheckForUpdateRequest,
	CheckForUpdateResponse,
	RegisterClientRequest,
	RegisterClientResponse,
	ClientReportRequest,
	ErrorReportRequest,
	EventType,
	SystemType,
} from 'shared'

export type ClientsMediatorFactory = (bundleId: string, systemType: SystemType) => ISocketMediator

export default function clientsMediatorFactory({ container }: interfaces.Context): ClientsMediatorFactory {
	const server = container.get<SocketIO.Server>(DI.Server)

	const updateService = container.get<IReleaseService>(DI.Services.Update)
	const clientService = container.get<IClientService>(DI.Services.Client)
	const reportsService = container.get<IVersionReportsService>(DI.Services.VersionReports)
	const clientCounterService = container.get<IClientCounterService>(DI.Services.ClientCounter)

	const validationHook = container.get<IPreRespondHook>(DI.Hooks.Validation)
	const reportHook = container.get<IPostRespondHook>(DI.Hooks.Report)

	return (bundleId: string, systemType: SystemType) => {
		const namespaceName = `/${bundleId}/${systemType}`

		return new SocketMediator(server.of(namespaceName))
			.use({
				eventType: EventType.CheckForUpdate,
				handler: updateService.checkForUpdate,
				requestType: CheckForUpdateRequest,
				responseType: CheckForUpdateResponse,
			})
			.use({
				eventType: EventType.RegisterClient,
				handler: clientService.registerClient,
				requestType: RegisterClientRequest,
				responseType: RegisterClientResponse,
			})
			.use({
				eventType: EventType.UpdateDownloading,
				handler: reportsService.downloadingUpdate,
				requestType: ClientReportRequest,
			})
			.use({
				eventType: EventType.UpdateDownloaded,
				handler: reportsService.downloadedUpdate,
				requestType: ClientReportRequest,
			})
			.use({
				eventType: EventType.UpdateUsing,
				handler: reportsService.usingUpdate,
				requestType: ClientReportRequest,
			})
			.use({
				eventType: EventType.UpdateError,
				handler: reportsService.error,
				requestType: ErrorReportRequest,
			})
			.pre(validationHook)
			.post(reportHook)
			.on(EventType.Connection, clientCounterService.handleClientConnection)
			.on(EventType.Disconnect, clientCounterService.handleClientDisconnection)
	}
}
