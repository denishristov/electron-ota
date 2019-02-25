import { ObjectID } from 'bson'
import {
	ClientReportRequest,
	ErrorReportRequest,
	GetAppUsingReportsRequest,
	GetAppUsingReportsResponse,
	GetSimpleVersionReportsRequest,
	GetSimpleVersionReportsResponse,
	GetVersionGroupedReportsRequest,
	GetVersionGroupedReportsResponse,
	GetVersionReportsRequest,
	GetVersionReportsResponse,
	SystemType,
} from 'shared'
import { InstanceType, ModelType } from 'typegoose'

import { App } from '../models/App'
import { Client } from '../models/Client'
import { Version } from '../models/Version'
import { VersionReports } from '../models/VersionReports'
import { toUTCString } from '../util/functions'
import { ITimestampedObject } from '../util/types'

export interface IVersionReportsService {
	downloadingUpdate(req: ClientReportRequest): Promise<IReportFeedback>
	downloadedUpdate(req: ClientReportRequest): Promise<IReportFeedback>
	usingUpdate(req: ClientReportRequest): Promise<IReportFeedback>
	errorOnUpdate(req: ErrorReportRequest): Promise<IReportFeedback>
	getSimpleVersionReports(req: GetSimpleVersionReportsRequest): Promise<GetSimpleVersionReportsResponse>
	getVersionReports(req: GetVersionReportsRequest): Promise<GetVersionReportsResponse>
	getAppUsingReports(req: GetAppUsingReportsRequest): Promise<GetAppUsingReportsResponse>
	getVersionGroupedReports(req: GetVersionGroupedReportsRequest): Promise<GetVersionGroupedReportsResponse>
}

export interface IReportFeedback {
	exists: boolean
}

@DI.injectable()
export default class VersionReportsService implements IVersionReportsService {
	private static readonly fields = [
		'downloading',
		'downloaded',
		'using',
		'errorMessages',
	]

	constructor(
		@DI.inject(DI.Models.Client)
		private readonly ClientModel: ModelType<Client>,
		@DI.inject(DI.Models.VersionReports)
		private readonly VersionReportsModel: ModelType<VersionReports>,
		@DI.inject(DI.Models.App)
		private readonly AppModel: ModelType<App>,
	) {
		// this.getAppUsingReports('5c66bc65781c7c4e2d980b89').then(console.log)
	}

	@bind
	public async downloadingUpdate({ id, versionId }: ClientReportRequest) {
		const report = await this.VersionReportsModel.findOneAndUpdate(
			{ 'version': versionId, 'downloading.client': { $ne: new ObjectID(id) } },
			{ $push: { downloading: { client: id } } },
		)

		return { exists: !report }
	}

	@bind
	public async downloadedUpdate({ id, versionId }: ClientReportRequest) {
		const report = await this.VersionReportsModel.findOneAndUpdate(
			{ 'version': versionId, 'downloaded.client': { $ne: new ObjectID(id) } },
			{ $push: { downloaded: { client: id } } },
		)

		return { exists: !report }
	}

	@bind
	public async usingUpdate({ id, versionId }: ClientReportRequest) {
		const client = await this.ClientModel.findById(id).select('version')

		if (client.version && client.version.toString() === versionId) {
			return
		}

		const report = await this.VersionReportsModel.findOneAndUpdate(
			{ 'version': versionId, 'using.client': { $ne: new ObjectID(id) } },
			{ $push: { using: { client: id } } },
		)

		await client.set({ version: versionId }).save()

		return { exists: !report }
	}

	@bind
	public async errorOnUpdate({ id, versionId, errorMessage }: ErrorReportRequest) {
		const report = await this.VersionReportsModel.findOneAndUpdate(
			{ 'version': versionId, 'errorMessages.client': { $ne: new ObjectID(id) } },
			{ $push: { errorMessages: { client: id, errorMessage } } },
		)

		return { exists: !report }
	}

	@bind
	public async getSimpleVersionReports({ appId }: GetSimpleVersionReportsRequest) {
		const { versions } = await this.AppModel
			.findById(appId)
			.select('versions')
			.sort({ ['versions.createdAt']: 1 })

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
			.populate(VersionReportsService.fields.map((key) => `${key}.client`).join(' '))

		const { id, ...rest } = reports.toJSON()

		return { ...rest, version }
	}

	@bind
	public async getAppUsingReports({ appId }: GetAppUsingReportsRequest) {
		const { versions } = await this.AppModel
			.findById(appId)
			.select('versions')

		const reports = await this.VersionReportsModel
			.find({ version: { $in: versions } })
			.select('using version.versionName')
			.populate('using.client version')

		const result = reports.group(({ using, version }) => {
			const systemTypeReports = Object.values(SystemType).group((systemType) => [systemType, 0])

			for (const report of using) {
				++systemTypeReports[(report.client as InstanceType<Client>).systemType]
			}

			return [(version as InstanceType<Version>).versionName, systemTypeReports]
		})

		return { reports: result }
	}

	@bind
	public async getVersionGroupedReports({ versionId }: GetVersionGroupedReportsRequest) {
		const { fields } = VersionReportsService

		const promises = await Promise.all(fields.map((field) => this.getReportsGroupedByHour(versionId, field)))

		const reports = fields.group((field, i) => {
			const mapped = promises[i].map(({ _id, count }) => ({
				timestamp: toUTCString(_id),
				count,
			}))

			return [field, mapped]
		})

		return { reports }
	}

	private async getReportsGroupedByHour(
		versionId: string,
		field: string,
	): Promise<Array<{ _id: ITimestampedObject, count: number }>> {
		const $field = `$${field}`
		const $timestamp = `${$field}.timestamp`

		return await this.VersionReportsModel.aggregate([
			{ $match: { version: new ObjectID(versionId) } },
			{ $unwind: $field },
			{ $sort: { [`${field}.timestamp`]: 1 } },
			{ $group: {
				_id: {
					hour: { $hour: $timestamp },
					day: { $dayOfMonth: $timestamp },
					month: { $month: $timestamp },
					year: { $year: $timestamp },
				},
				count: { $sum: 1 },
			} },
		])
	}
}
