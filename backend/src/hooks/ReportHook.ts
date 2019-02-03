
import { EventType, ErrorReportRequest, ClientReportRequest } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'
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
		{ id, versionId, ...rest }: ClientReportRequest | ErrorReportRequest,
	) {
		const client = await this.clientsService.getClient(id)
		const { app: appId } = await this.versions.findById(versionId).select('app')

		this.adminMediator.broadcast(eventType, {
			client,
			versionId,
			appId,
			...rest,
		})
	}
}
