import {
	CheckForUpdateRequest,
	CheckForUpdateResponse,
	PublishVersionRequest,
	PublishVersionResponse,
	SystemType,
} from 'shared'

import semver from 'semver'
import { Version } from '../models/Version'
import { App } from '../models/App'
import { ModelType } from 'typegoose'

export interface IReleaseService {
	checkForUpdate(req: CheckForUpdateRequest): Promise<CheckForUpdateResponse>
	releaseVersion(req: PublishVersionRequest): Promise<PublishVersionResponse>
}

const defaultResponse = {
	isUpToDate: true,
}

@DI.injectable()
export default class ReleaseService implements IReleaseService {
	constructor(
		@DI.inject(DI.Models.App)
		private readonly AppModel: ModelType<App>,
		@DI.inject(DI.Models.Version)
		private readonly VersionModel: ModelType<Version>,
	) {}

	@bind
	public async releaseVersion({ versionId }: PublishVersionRequest): Promise<PublishVersionResponse> {
		const version = await this.VersionModel.findById(versionId).select(`
			systems
			appId
			isReleased
		`)

		if (version.isReleased) {
			throw new Error('Version already released')
		}

		version.isReleased = true
		await version.save()

		const latestVersions = Object.keys(version.systems)
			.filter((systemType: SystemType) => version.systems[systemType])
			.group((systemType) => [systemType, versionId])

		await this.AppModel.findOneAndUpdate(
			{ _id: version.appId },
			{ $set: { latestVersions } },
		)

		return {
			isSuccessful: true,
			versionId,
		}
	}

	@bind
	public async checkForUpdate(
		{ versionName, bundleId, systemType }: CheckForUpdateRequest,
	): Promise <CheckForUpdateResponse> {
		const { latestVersions } = await this.AppModel
			.findOne({ bundleId })
			.select('latestVersions')
			.populate(`latestVersions.${systemType}`)

		const latestVersion = latestVersions && latestVersions[systemType] as Version

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
