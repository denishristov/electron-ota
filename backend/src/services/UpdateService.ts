import {
	ICheckForUpdateRequest,
	ICheckForUpdateResponse,
	IPublishVersionRequest,
	IPublishVersionResponse,
	SystemType,
} from 'shared'

import semver from 'semver'
import { Model } from 'mongoose'
import { IReleaseDocument } from '../models/Release'
import { IVersionDocument } from '../models/Version'
import { IAppDocument } from '../models/App'

export interface IReleaseService {
	checkForUpdate(req: ICheckForUpdateRequest): Promise<ICheckForUpdateResponse>
	releaseVersion(req: IPublishVersionRequest): Promise<IPublishVersionResponse>
}

const defaultResponse = {
	isUpToDate: true,
}

@DI.injectable()
export default class ReleaseService implements IReleaseService {
	constructor(
		@DI.inject(DI.Models.Update)
		private readonly releases: Model<IReleaseDocument>,
		@DI.inject(DI.Models.App)
		private readonly apps: Model<IAppDocument>,
		@DI.inject(DI.Models.Version)
		private readonly versions: Model<IVersionDocument>,
	) {}

	@bind
	public async releaseVersion({
		versionId,
	}: IPublishVersionRequest): Promise<IPublishVersionResponse> {
		try {
			// const totalClientCount = clientCount
			// 	? clients
			// 		? clientCount + clients.length
			// 		: clientCount
			// 	: clients && clients.length

			// const release = this.releases.create({
			// 	systems,
			// 	clientCount: totalClientCount,
			// })

			const { app: appId, systems } = await this.versions.findById(versionId).select(`
				systems
				addId
			`)

			// release.then((release) => {
			// 	version.releases.push(release)
			// 	version.save()
			// })

			const latestVersions = Object.keys(systems)
					.filter((systemType) => systems[systemType as SystemType])
					.group((systemType) => [systemType, versionId])

			await this.apps.findByIdAndUpdate(
					appId,
					{ latestVersions },
					{ upsert: true },
				)

			return {
				isSuccessful: true,
				release: {
					versionId,
				},
			}
		 } catch (error) {
			return {
				isSuccessful: false,
				errorMessage: error.message,
			}
		}
	}

	@bind
	public async checkForUpdate(
		{ versionName, bundleId, systemType }: ICheckForUpdateRequest,
	): Promise < ICheckForUpdateResponse > {
		const { latestVersions } = await this.apps
			.findOne({ bundleId })
			.populate(`latestVersions.${systemType}`)

		const latestVersion = latestVersions && latestVersions[systemType]

		if (latestVersion && semver.lt(versionName, latestVersion.versionName)) {
			const {
				isBase,
				isCritical,
				description,
				downloadUrl,
				hash,
				versionName,
			} = latestVersion

			return {
				isUpToDate: false,
				update: {
					isBase,
					isCritical,
					description,
					downloadUrl,
					hash,
					versionName,
				},
			}
		}

		return defaultResponse
	}
}
