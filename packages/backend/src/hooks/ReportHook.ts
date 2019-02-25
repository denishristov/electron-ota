
import { EventType, ErrorReportRequest, ClientReportRequest } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'
import {  ModelType } from 'typegoose'
import { Version } from '../models/Version'
import { VersionReports } from '../models/VersionReports'
import { IReportFeedback } from '../services/VersionReportsService'

export interface IReportHook extends IPostRespondHook {
	handle(
		eventType: EventType,
		req: ClientReportRequest | ErrorReportRequest,
		res: IReportFeedback,
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
		{ exists }: IReportFeedback,
	) {
		if (!exists) {
			const [_, type] = eventType.split('.')

			const { appId } = await this.VersionModel.findById(versionId).select('appId')
			const reports = await this.VersionReportModel
				.findOne({
					version: versionId,
					[`${type}.client`]: id,
				})
				.select(`${type} timestamp`)
				.populate(`${type}.client`)

			const { timestamp, client } = (reports as any)[type][0]

			this.mediators.get(DI.AdminMediator).broadcast(eventType, {
				appId,
				versionId,
				timestamp,
				client: client.toJSON(),
				...rest,
			})
		}
	}
}
