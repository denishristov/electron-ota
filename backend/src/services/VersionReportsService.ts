import { Model } from 'mongoose'
import {
	IClientReportRequest,
	IErrorReportRequest,
	IGetSimpleVersionReportsRequest,
	IGetSimpleVersionReportsResponse,
	IGetVersionReportsRequest,
	IGetVersionReportsResponse,
} from 'shared'
import { IVersionDocument } from '../models/Version'
import { IClientDocument } from '../models/Client'
import { IVersionReportsDocument } from '../models/VersionReports'
import { IAppDocument } from '../models/App'
import { toModel } from '../util/util'

export interface IVersionReportsService {
	downloadingUpdate(req: IClientReportRequest): Promise<void>
	downloadedUpdate(req: IClientReportRequest): Promise<void>
	usingUpdate(req: IClientReportRequest): Promise<void>
	error(req: IErrorReportRequest): Promise<void>
	getSimpleVersionReports(req: IGetSimpleVersionReportsRequest): Promise<IGetSimpleVersionReportsResponse>
	getVersionReports(req: IGetVersionReportsRequest): Promise<IGetVersionReportsResponse>
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
	public async downloadingUpdate({ id, versionId }: IClientReportRequest) {
		await this.reports.findOneAndUpdate(
			{ version: versionId },
			{ $addToSet: { downloading: id } },
		)
	}

	@bind
	public async downloadedUpdate({ id, versionId }: IClientReportRequest) {
		await this.reports.findOneAndUpdate(
			{ version: versionId },
			{
				$pull: { downloading: id } ,
				$addToSet: { downloaded: id },
			},
		)
	}

	@bind
	public async usingUpdate({ id, versionId }: IClientReportRequest) {
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
	public async error({ id, versionId, errorMessage }: IErrorReportRequest) {
		await this.reports.findOneAndUpdate(
			{ version: versionId },
			{ $push: { errorMessages: { client: id, errorMessage } } },
		)
	}

	@bind
	public async getSimpleVersionReports({ appId }: IGetSimpleVersionReportsRequest) {
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
	public async getVersionReports({ versionId }: IGetVersionReportsRequest): Promise<IGetVersionReportsResponse> {
		const reports = await this.reports
			.findOne({ version: versionId })
			.populate(VersionReportsService.fields)
			.select(VersionReportsService.fields)

		return toModel(reports)
	}
}
