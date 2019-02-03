import { Model } from 'mongoose'
import {
	ClientReportRequest,
	ErrorReportRequest,
	GetSimpleVersionReportsRequest,
	GetSimpleVersionReportsResponse,
	GetVersionReportsRequest,
	GetVersionReportsResponse,
} from 'shared'
import { IVersionDocument } from '../models/Version'
import { IClientDocument } from '../models/Client'
import { IVersionReportsDocument } from '../models/VersionReports'
import { IAppDocument } from '../models/App'
import { toModel } from '../util/util'

export interface IVersionReportsService {
	downloadingUpdate(req: ClientReportRequest): Promise<void>
	downloadedUpdate(req: ClientReportRequest): Promise<void>
	usingUpdate(req: ClientReportRequest): Promise<void>
	error(req: ErrorReportRequest): Promise<void>
	getSimpleVersionReports(req: GetSimpleVersionReportsRequest): Promise<GetSimpleVersionReportsResponse>
	getVersionReports(req: GetVersionReportsRequest): Promise<GetVersionReportsResponse>
}

@DI.injectable()
export default class VersionReportsService implements IVersionReportsService {
	private static readonly fields = 'downloading downloaded using errorMessages'

	constructor(
		@DI.inject(DI.Models.Version)
		public readonly versions: Model<IVersionDocument>,
		@DI.inject(DI.Models.Client)
		private readonly clients: Model<IClientDocument>,
		@DI.inject(DI.Models.VersionReports)
		private readonly reports: Model<IVersionReportsDocument>,
		@DI.inject(DI.Models.App)
		private readonly apps: Model<IAppDocument>,
	) {}

	@bind
	public async downloadingUpdate({ id, versionId }: ClientReportRequest) {
		await this.reports.findOneAndUpdate(
			{ version: versionId },
			{ $addToSet: { downloading: id } },
		)
	}

	@bind
	public async downloadedUpdate({ id, versionId }: ClientReportRequest) {
		await this.reports.findOneAndUpdate(
			{ version: versionId },
			{
				$pull: { downloading: id } ,
				$addToSet: { downloaded: id },
			},
		)
	}

	@bind
	public async usingUpdate({ id, versionId }: ClientReportRequest) {
		const client = await this.clients.findById(id).select('version')

		if (client.version && client.version.toString() === versionId) {
			return
		}

		await this.reports.findOneAndUpdate(
			{ version: versionId },
			{ $addToSet: { using: id } },
		)

		await client.set({ version: versionId }).save()
	}

	@bind
	public async error({ id, versionId, errorMessage }: ErrorReportRequest) {
		await this.reports.findOneAndUpdate(
			{ version: versionId },
			{ $push: { errorMessages: { client: id, errorMessage } } },
		)
	}

	@bind
	public async getSimpleVersionReports({ appId }: GetSimpleVersionReportsRequest) {
		const { versions } = await this.apps.findById(appId).select('versions')

		const reports = await this.reports.aggregate([
			{ $match: { version: { $in: versions } } },
			{ $project: {
				downloadingCount: { $size: '$downloading' },
				downloadedCount: { $size: '$downloaded' },
				usingCount: { $size: '$using' },
				errorsCount: { $size: '$errorMessages' },
				version: '$version',
			}},
		])

		return { reports }
	}

	@bind
	public async getVersionReports(arg: GetVersionReportsRequest): Promise<GetVersionReportsResponse> {
		const reports = await this.reports
			.findOne({ version: arg.versionId })
			.populate(VersionReportsService.fields)
			.select(VersionReportsService.fields)

		return toModel(reports)
	}
}
