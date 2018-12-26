import {
	IAppModel,
	ICheckForUpdateRequest,
	ICheckForUpdateResponse,
	IPublishVersionRequest,
	IPublishVersionResponse,
} from 'shared'

import { IVersionService } from './VersionService'
import { IAppService } from './AppService'

export interface IAppUpdateService {
	publishVersion(req: IPublishVersionRequest): Promise<IPublishVersionResponse>
	checkForUpdate(app: IAppModel):
		(req: ICheckForUpdateRequest) => Promise<ICheckForUpdateResponse>
}

@DI.injectable()
export default class AppUpdateService implements IAppUpdateService {
	constructor(
		@DI.inject(DI.Services.Version) private readonly versionService: IVersionService,
		@DI.inject(DI.Services.App) private readonly appService: IAppService,
	) {}

	@bind
	public async publishVersion(req: IPublishVersionRequest): Promise<IPublishVersionResponse> {
		try {
			await this.versionService.updateVersion({ ...req, isPublished: true })
			await this.appService.updateApp({ id: req.appId, latestVersion: req.id })

			return {
				isSuccessful: true,
			}
		} catch (error) {
			return {
				isSuccessful: false,
				errorMessage: error.message,
			}
		}
	}

	@bind
	public checkForUpdate(app: IAppModel):
		(req: ICheckForUpdateRequest) => Promise<ICheckForUpdateResponse> {
		return async ({ versionName }: ICheckForUpdateRequest): Promise<ICheckForUpdateResponse> => {
			const version = await this.versionService.getVersion({ id: app.latestVersion })

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
				} = version

				return {
					isUpToDate: false,
					isBase,
					isCritical,
					description,
					downloadUrl,
				}
			}
		}
	}
}
