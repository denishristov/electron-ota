import { Model } from 'mongoose'
import { IClientReport, IErrorReport, IGetVersionSimpleReports } from 'shared'
import { IVersionDocument } from '../models/Version'
import { IClientDocument } from '../models/Client'
import { IVersionStatisticsDocument } from '../models/VersionStatistics'
import { ObjectID } from 'bson'

export interface IVersionStatisticsService {
	downloadingUpdate({ clientId }: IClientReport): Promise<void>
	downloadedUpdate({ clientId }: IClientReport): Promise<void>
	usingUpdate({ clientId }: IClientReport): Promise<void>
	error({ clientId, errorMessage }: IErrorReport): Promise<void>
	getVersionSimpleReports(req: IGetVersionSimpleReports): Promise<object>
}

@DI.injectable()
export default class VersionStatisticsService implements IVersionStatisticsService {
	constructor(
		@DI.inject(DI.Models.Version)
		public readonly versions: Model<IVersionDocument>,
		@DI.inject(DI.Models.Client)
		private readonly clients: Model<IClientDocument>,
		@DI.inject(DI.Models.VersionStatistics)
		private readonly statistics: Model<IVersionStatisticsDocument>,
	) {
		// this.getVersionSimpleReports()
	}

	@bind
	public async downloadingUpdate({ clientId, versionId }: IClientReport) {
		await this.statistics.findOneAndUpdate(
			{ version: versionId },
			{ $addToSet: { downloading: clientId } },
		)
	}

	@bind
	public async downloadedUpdate({ clientId, versionId }: IClientReport) {
		await this.statistics.findOneAndUpdate(
			{ version: versionId },
			{
				$pull: { downloading: clientId } ,
				$addToSet: { downloaded: versionId },
			},
		)
	}

	@bind
	public async usingUpdate({ clientId, versionId }: IClientReport) {
		const client = await this.clients.findById(clientId).select('version')

		if (client.version && client.version.toString() === versionId) {
			return
		}

		if (client.version) {
			await this.versions.findOneAndUpdate(
				{ version: versionId },
				{ $pull: { using: clientId } },
			)
		}

		await this.statistics.findOneAndUpdate(
			{ version: versionId },
			{ $addToSet: { using: clientId } },
		)

		client.set({ version: versionId })

		await client.save()
	}

	@bind
	public async error({ clientId, versionId, errorMessage }: IErrorReport) {
		await this.statistics.findOneAndUpdate(
			{ version: versionId },
			{ $push: { errorMessages: { client: clientId, errorMessage } } },
		)
	}

	@bind
	public async getVersionSimpleReports({ versionId }: IGetVersionSimpleReports) {
		const [statistics] = await this.statistics.aggregate([
			{ $match: { version: new ObjectID(versionId) } },
			{ $project: {
				downloading: { $size: '$downloading' },
				downloaded: { $size: '$downloaded' },
				using: { $size: '$using' },
				errorMessages: { $size: '$errorMessages' },
			}},
		])

		// tslint:disable-next-line:no-console
		return statistics
	}
}
