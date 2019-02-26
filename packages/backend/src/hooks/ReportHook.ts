
import { EventType, ErrorReportRequest, ClientReportRequest } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'
import { ModelType, InstanceType } from 'typegoose'
import { Version } from '../models/Version'
import { VersionReports, ReportType } from '../models/VersionReports'
import { Client } from '../models/Client'

export interface IReportHook extends IPostRespondHook {
	handle(
		eventType: string,
		req: ClientReportRequest | ErrorReportRequest,
	): Promise<void>
}

@DI.injectable()
export default class ReportHook implements IReportHook {
	public eventTypes = new Set([
		EventType.UpdateDownloading,
		EventType.UpdateDownloaded,
		EventType.UpdateUsing,
		EventType.UpdateError,
	])

	constructor(
		@DI.inject(DI.Mediators)
		private readonly mediators: Map<string, ISocketMediator>,
		@DI.inject(DI.Models.Version)
		public readonly VersionModel: ModelType<Version>,
		@DI.inject(DI.Models.VersionReports)
		public readonly VersionReportModel: ModelType<VersionReports>,
	) {}

	@bind
	public async handle(
		eventType: EventType,
		{ id, versionId, ...rest }: ClientReportRequest | ErrorReportRequest,
	) {
		const [_, type] = eventType.split('.')

		const { appId } = await this.VersionModel.findById(versionId).select('appId')
		const reports = await this.VersionReportModel
			.findOne({
				version: versionId,
				[`${type}.client`]: id,
			})
			.select(`${type} timestamp`)
			.populate(`${type}.client`)

		const { timestamp, client } = (reports)[type as ReportType][0]

		this.mediators.get(DI.AdminMediator).broadcast(eventType, {
			appId,
			versionId,
			timestamp,
			client: (client as InstanceType<Client>).toJSON(),
			...rest,
		})
	}
}
