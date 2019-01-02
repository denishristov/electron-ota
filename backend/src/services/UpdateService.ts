import {
	IAppModel,
	ICheckForUpdateRequest,
	ICheckForUpdateResponse,
} from 'shared'

import { IVersionService } from './VersionService'

import semver from 'semver'

export type UpdateServiceFactory = (app: IAppModel) => IUpdateService

export interface IUpdateService {
	checkForUpdate({ versionName }: ICheckForUpdateRequest): Promise<ICheckForUpdateResponse>
}

const defaultResponse = {
	isUpToDate: true,
}

export default class UpdateService implements IUpdateService {
	constructor(
		private readonly versionService: IVersionService,
		private readonly app: IAppModel,
	) {}

	@bind
	public async checkForUpdate(
		{ versionName }: ICheckForUpdateRequest,
	): Promise<ICheckForUpdateResponse> {
		if (!this.app.latestVersion) {
			return defaultResponse
		}

		const version = await this.versionService.getVersion({
			id: this.app.latestVersion.id,
			appId: this.app.id,
		})

		if (semver.lt(versionName, version.versionName)) {
			const {
				isBase,
				isCritical,
				description,
				downloadUrl,
				hash,
				versionName,
			} = version

			return {
				isUpToDate: false,
				isBase,
				isCritical,
				description,
				downloadUrl,
				hash,
				versionName,
			}
		}

		return defaultResponse
	}
}
