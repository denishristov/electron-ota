
import { EventType, IErrorReportRequest, IClientReportRequest } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/Interfaces'
import { IClientService } from '../services/ClientService'
import { Model } from 'mongoose'
import { IVersionDocument } from '../models/Version'

@DI.injectable()
export default class ReportHook implements IPostRespondHook {
	public eventTypes = new Set([
		EventType.UpdateDownloading,
		EventType.UpdateDownloaded,
		EventType.UpdateUsing,
		EventType.UpdateError,
	])

	constructor(
		@DI.inject(DI.Mediators.Admins)
		private readonly adminMediator: ISocketMediator,
		@DI.inject(DI.Services.Client)
		private readonly clientsService: IClientService,
		@DI.inject(DI.Models.Version)
		public readonly versions: Model<IVersionDocument>,
	) {}

	@bind
	public async handle(
		eventType: EventType,
		{ clientId, versionId, ...rest }: IClientReportRequest | IErrorReportRequest,
	) {
		const client = await this.clientsService.getClient(clientId)
		const { app: appId } = await this.versions.findById(versionId).select('app')

		this.adminMediator.broadcast(eventType, {
			client,
			versionId,
			appId,
			...rest,
		})
	}
}
