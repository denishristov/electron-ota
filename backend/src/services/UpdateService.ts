import {
	IAppModel,
	ICheckForUpdateRequest,
	ICheckForUpdateResponse,
} from 'shared'

import { IVersionService } from './VersionService'

export type UpdateServiceFactory = (app: IAppModel) => IUpdateService

export interface IUpdateService {
	checkForUpdate({ versionName }: ICheckForUpdateRequest): Promise<ICheckForUpdateResponse>
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
		const version = await this.versionService.getVersion({
			id: this.app.latestVersion.id,
			appId: this.app.id,
		})

		if (version.versionName === versionName) {
			return {
				isUpToDate: true,
			}
		} else {
			const {
				isBase,
				isCritical,
				description,
				downloadUrl,
				hash,
			} = version

			return {
				isUpToDate: false,
				isBase,
				isCritical,
				description,
				downloadUrl,
				hash,
			}
		}
	}
}
