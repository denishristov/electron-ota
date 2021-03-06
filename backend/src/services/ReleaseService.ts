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
import { IAdminsService, IAuthenticatedRequest } from './AdminsService'
import { ObjectID } from 'bson'

export interface IReleaseService {
	checkForUpdate(req: CheckForUpdateRequest): Promise<CheckForUpdateResponse>
	releaseVersion(req: PublishVersionRequest): Promise<PublishVersionResponse>
}

const defaultResponse = {
	isUpToDate: true,
}

@injectable()
export default class ReleaseService implements IReleaseService {
	constructor(
		@inject(nameof<IAppService>())
		private readonly appService: IAppService,
		@inject(nameof<Version>())
		private readonly VersionModel: ModelType<Version>,
		@inject(nameof<IAdminsService>())
		private readonly adminService: IAdminsService,
	) {}

	@bind
	public async releaseVersion({
		versionId,
		password,
		payload: { id },
	}: PublishVersionRequest & IAuthenticatedRequest): Promise<PublishVersionResponse> {
		if (!await this.adminService.validatePassword(id, password)) {
			throw new Error('Invalid password')
		}

		const version = await this.VersionModel.findById(versionId).select(`
			systems
			appId
			isReleased
		`)

		if (version.isReleased) {
			throw new Error('Version already released')
		}

		version.isReleased = true
		version.releasedBy = new ObjectID(id)

		await version.save()

		return {
			versionId,
			appId: version.appId,
			releasedBy: await this.adminService.getPublicProfile(id),
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
				id: versionId,
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
					versionId,
				},
			}
		}

		return defaultResponse
	}
}
