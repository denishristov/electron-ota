import { Model } from 'mongoose'
import { IClientReport, IErrorReport } from 'shared'
import { IVersionDocument } from '../models/Version'
import { IClientDocument } from '../models/Client'

export interface IVersionStatisticsService {
	downloadingUpdate({ sessionId }: IClientReport): Promise<void>
	downloadedUpdate({ sessionId }: IClientReport): Promise<void>
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
	) {}

	@bind
	public async downloadingUpdate({ sessionId }: IClientReport) {
		const client = await this.clients.findOne({ sessionId })

		await this.versions.findByIdAndUpdate(client.updatingVersion.id, {
			$push: {
				statistics: {
					downloading: client,
				},
			},
		})
	}

	@bind
	public async downloadedUpdate({ sessionId }: IClientReport) {
		const client = await this.clients.findOne({ sessionId })

		await this.versions.findByIdAndUpdate(client.updatingVersion.id, {
			$pull: {
				statistics: {
					downloading: client,
				},
			},
		})

		await this.versions.findByIdAndUpdate(client.updatingVersion.id, {
			$push: {
				statistics: {
					downloaded: client,
				},
			},
		})
	}

	@bind
	public async usingUpdate({ sessionId }: IClientReport) {
		const client = await this.clients.findOne({ sessionId })

		await this.versions.findByIdAndUpdate(client.version.id, {
			$pull: {
				statistics: {
					using: client,
				},
			},
		})

		await this.versions.findByIdAndUpdate(client.updatingVersion.id, {
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

		await this.versions.findByIdAndUpdate(client.updatingVersion.id, {
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
}
