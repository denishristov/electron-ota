import { Model } from 'mongoose'
import { IClientReport, IErrorReport } from 'shared'
import { IVersionDocument } from '../models/Version'
import { IClientDocument } from '../models/Client'
import { IVersionStatisticsDocument } from '../models/VersionStatistics'

export interface IVersionStatisticsService {
	downloadingUpdate({ clientId }: IClientReport): Promise<void>
	downloadedUpdate({ clientId }: IClientReport): Promise<void>
	usingUpdate({ clientId }: IClientReport): Promise<void>
	error({ clientId, errorMessage }: IErrorReport): Promise<void>
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
	) {}

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
		const client = await this.clients.findOne({ clientId })

		await this.statistics.findOneAndUpdate(
			{ version: versionId },
			{ $push: { errorMessages: { client, errorMessage } } },
		)
	}

	@bind
	public async getVersionSimpleReports(version: string) {
		const a = await this.statistics.aggregate([
			{ $match: { version } },
			{ $size: '$downloading' },
			{ $size: '$downloaded' },
			{ $size: '$using' },
			{ $size: '$errors' },
		])

		// tslint:disable-next-line:no-console
		console.log(a)
	}
}
