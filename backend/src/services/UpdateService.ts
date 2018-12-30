import {
	IAppModel,
	ICheckForUpdateRequest,
	ICheckForUpdateResponse,
} from 'shared'

import { IVersionService } from './VersionService'

export type UpdateServiceFactory = (app: IAppModel) => IUpdateService

export interface IUpdateService {
	checkForUpdate(
		app: IAppModel,
		{ versionName }: ICheckForUpdateRequest,
	): Promise<ICheckForUpdateResponse>
}

@DI.injectable()
export default class UpdateService implements IUpdateService {
	constructor(
		@DI.inject(DI.Services.Version) private readonly versionService: IVersionService,
	) {}

	@bind
	public async checkForUpdate(
		app: IAppModel,
		{ versionName }: ICheckForUpdateRequest,
	): Promise<ICheckForUpdateResponse> {
		const version = await this.versionService.getVersion({
			id: app.latestVersion.id,
			appId: app.id,
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
