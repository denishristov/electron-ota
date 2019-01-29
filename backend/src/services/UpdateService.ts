import {
	ICheckForUpdateRequest,
	ICheckForUpdateResponse,
	IPublishVersionRequest,
	IPublishVersionResponse,
	SystemType,
} from 'shared'

import semver from 'semver'
import { Model } from 'mongoose'
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
			const version = await this.versions.findById(versionId).select(`
				systems
				addId
			`)

			if (version.isReleased) {
				throw new Error('Version already released')
			}

			version.isReleased = true
			await version.save()

			const latestVersions = Object.keys(version.systems)
				.filter((systemType: SystemType) => version.systems[systemType])
				.group((systemType) => [systemType, versionId])

			await this.apps.findByIdAndUpdate(
				version.app,
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
