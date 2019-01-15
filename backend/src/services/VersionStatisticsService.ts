import { Model } from 'mongoose'
import { IClientReport, IErrorReport } from 'shared'
import { IVersionDocument } from '../models/Version'
import { IClientDocument } from '../models/Client'
import { IVersionStatisticsDocument } from '../models/VersionStatistics'

export interface IVersionStatisticsService {
	downloadingUpdate({ sessionId }: IClientReport): Promise<object>
	downloadedUpdate({ sessionId }: IClientReport): Promise<object>
	usingUpdate({ sessionId }: IClientReport): Promise<void>
	error({ sessionId, errorMessage }: IErrorReport): Promise<void>
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
	public async downloadingUpdate({ sessionId, versionId }: IClientReport) {
		await this.statistics.findOneAndUpdate(
			{ version: versionId },
			{ $addToSet: { downloading: sessionId } },
		)

		return {}
	}

	@bind
	public async downloadedUpdate({ sessionId, versionId }: IClientReport) {
		await this.statistics.findOneAndUpdate(
			{ version: versionId },
			{ $pull: { downloading: sessionId } },
			{ $addToSet: { statistics: { downloaded: versionId } } },
		)

		return {}
	}

	@bind
	public async usingUpdate({ sessionId }: IClientReport) {
		const client = await this.clients.findOne({ sessionId })

		await this.versions.findByIdAndUpdate(client.version, {
			$pull: {
				statistics: {
					using: client,
				},
			},
		})

		await this.versions.findByIdAndUpdate(client.updatingVersion, {
			$push: {
				statistics: {
					using: client,
				},
			},
		})

		client.version = client.updatingVersion
		client.updatingVersion = null

		await client.save()
	}

	@bind
	public async error({ sessionId, errorMessage }: IErrorReport) {
		const client = await this.clients.findOne({ sessionId })

		await this.versions.findByIdAndUpdate(client.updatingVersion, {
			$push: {
				statistics: {
					errorMessages: {
						client,
						errorMessage,
					},
				},
			},
		})
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
