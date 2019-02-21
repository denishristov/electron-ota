import {
	ClientReportRequest,
	ErrorReportRequest,
	GetSimpleVersionReportsRequest,
	GetSimpleVersionReportsResponse,
	GetVersionReportsRequest,
	GetVersionReportsResponse,
} from 'shared'
import { Version } from '../models/Version'
import { Client } from '../models/Client'
import { VersionReports } from '../models/VersionReports'
import { App } from '../models/App'
import { ModelType } from 'typegoose'
import { Report } from '../models/Report'

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
		@DI.inject(DI.Models.Client)
		private readonly ClientModel: ModelType<Client>,
		@DI.inject(DI.Models.VersionReports)
		private readonly VersionReportsModel: ModelType<VersionReports>,
		@DI.inject(DI.Models.App)
		private readonly AppModel: ModelType<App>,
		@DI.inject(DI.Models.Report)
		private readonly ReportModel: ModelType<Report>,
	) {}

	@bind
	public async downloadingUpdate({ id, versionId }: ClientReportRequest) {
		const { ReportModel } = this

		const report = new ReportModel({ client: id })
		await report.save()

		await this.VersionReportsModel.findOneAndUpdate(
			{ version: versionId },
			{ $addToSet: { downloading: report } },
		)
	}

	@bind
	public async downloadedUpdate({ id, versionId }: ClientReportRequest) {
		const { ReportModel } = this

		const report = new ReportModel({ client: id })
		await report.save()

		await this.VersionReportsModel.findOneAndUpdate(
			{ version: versionId },
			{ $addToSet: { downloaded: report } },
		)
	}

	@bind
	public async usingUpdate({ id, versionId }: ClientReportRequest) {
		const client = await this.ClientModel.findById(id).select('version')

		if (client.version && client.version.toString() === versionId) {
			return
		}

		const { ReportModel } = this

		const report = new ReportModel({ client: id })
		await report.save()

		await this.VersionReportsModel.findOneAndUpdate(
			{ version: versionId },
			{ $addToSet: { using: report } },
		)

		await client.set({ version: versionId }).save()
	}

	@bind
	public async error({ id, versionId, errorMessage }: ErrorReportRequest) {
		const { ReportModel } = this

		const report = new ReportModel({ client: id, errorMessage })
		await report.save()

		await this.VersionReportsModel.findOneAndUpdate(
			{ version: versionId },
			{ $push: { errorMessages: report } },
		)
	}

	@bind
	public async getSimpleVersionReports({ appId }: GetSimpleVersionReportsRequest) {
		const { versions } = await this.AppModel.findById(appId).select('versions')

		const reports = await this.VersionReportsModel.aggregate([
			{ $match: { version: { $in: versions } } },
			{ $project: {
				_id : 0,
				downloadingCount: { $size: '$downloading' },
				downloadedCount: { $size: '$downloaded' },
				usingCount: { $size: '$using' },
				errorsCount: { $size: '$errorMessages' },
				version: { $toString: '$version' },
			}},
		])

		return { reports }
	}

	@bind
	public async getVersionReports({ versionId: version }: GetVersionReportsRequest): Promise<GetVersionReportsResponse> {
		const reports = await this.VersionReportsModel
			.findOne({ version })
			.populate(
				VersionReportsService.fields
				.split(' ')
				.map((key) => ({
					path: key,
					populate: {
						path: 'client',
					},
				}),
			))

		const { id, ...rest } = reports.toJSON()

		return { ...rest, version }
	}

	@bind
	public async getReportsGroupedByHour(versionId: string) {
		const da = await this.VersionReportsModel.aggregate([
			{
				$group: {
					_id: {
						$toDate: {
							$subtract: [
								{ $toLong: '$created_at' },
								{ $mod: [ { $toLong: '$created_at' }, 1000 * 60 * 60 ] },
							],
						},
			 		},
					count: { $sum: 1 },
				},
			},
		])
	}
}
