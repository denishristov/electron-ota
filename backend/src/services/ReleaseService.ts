import {
	CheckForUpdateRequest,
	CheckForUpdateResponse,
	PublishVersionRequest,
	PublishVersionResponse,
	SystemType,
} from 'shared'

import semver from 'semver'
import { Version } from '../models/Version'
import { ModelType } from 'typegoose'
import { IAppService } from './AppService'

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
		@DI.inject(DI.Services.App)
		private readonly appService: IAppService,
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

		return {
			isSuccessful: true,
			versionId,
		}
	}

	@bind
	public async checkForUpdate(
		{ versionName, bundleId, systemType }: CheckForUpdateRequest,
	): Promise <CheckForUpdateResponse> {
		const latestVersion = await this.appService.getAppLatestVersion(bundleId, systemType)

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
