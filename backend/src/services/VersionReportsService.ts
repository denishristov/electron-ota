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
	) {}

	@bind
	public async downloadingUpdate({ id, versionId }: ClientReportRequest) {
		await this.VersionReportsModel.findOneAndUpdate(
			{ version: versionId },
			{ $addToSet: { downloading: id } },
		)
	}

	@bind
	public async downloadedUpdate({ id, versionId }: ClientReportRequest) {
		await this.VersionReportsModel.findOneAndUpdate(
			{ version: versionId },
			{
				$pull: { downloading: id } ,
				$addToSet: { downloaded: id },
			},
		)
	}

	@bind
	public async usingUpdate({ id, versionId }: ClientReportRequest) {
		const client = await this.ClientModel.findById(id).select('version')

		if (client.version && client.version.toString() === versionId) {
			return
		}

		await this.VersionReportsModel.findOneAndUpdate(
			{ version: versionId },
			{ $addToSet: { using: id } },
		)

		await client.set({ version: versionId }).save()
	}

	@bind
	public async error({ id, versionId, errorMessage }: ErrorReportRequest) {
		await this.VersionReportsModel.findOneAndUpdate(
			{ version: versionId },
			{ $push: { errorMessages: { client: id, errorMessage } } },
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
			.populate(VersionReportsService.fields)
			.select(VersionReportsService.fields)

		const { id, ...rest } = reports.toJSON()

		return { ...rest, version }
	}
}
