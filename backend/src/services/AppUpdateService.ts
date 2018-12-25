import {
	IAppModel,
	ICheckForUpdateRequest,
	ICheckForUpdateResponse,
	IPublishVersionRequest as IReleaseUpdateRequest,
	IPublishVersionResponse as IReleaseUpdateResponse,
} from 'shared'
import { inject } from 'inversify'
import { Services } from '../dependencies/symbols'
import { IVersionService } from './VersionService'
// import { IAppService } from './AppService'
// import { IAppClientService } from './AppClientsService'

export interface IAppUpdateService {
	// releaseUpdate(req: IReleaseUpdateRequest): Promise<IReleaseUpdateResponse>
	checkForUpdate(req: ICheckForUpdateRequest): Promise<ICheckForUpdateResponse>
}

export default class AppUpdateService implements IAppUpdateService {
	constructor(
		private readonly app: IAppModel,
		// private readonly appClientsService: IAppClientService,
		@inject(Services.Version) private readonly versionService: IVersionService,
		// @inject(Services.App) private readonly appService: IAppService,
	) {}

	public async checkForUpdate({ versionName }: ICheckForUpdateRequest): Promise<ICheckForUpdateResponse> {
		const version = await this.versionService.getVersion({ id: this.app.latestVersion })

		if (version.versionName === versionName) {
			return {
				isUpToDate: true,
			}
		} else {
			const {
				isBase,
				isCritical,
				description,
			} = version

			return {
				isUpToDate: false,
				isBase,
				isCritical,
				description,
			}
		}
	}

	// public async releaseUpdate(req: IReleaseUpdateRequest): Promise<IReleaseUpdateResponse> {
	// 	try {
	// 		const version = await this.versionService.getVersion({ versionId: req.id })

	// 		this.versionService.updateVersion({ ...req, isPublished: true })
	// 		this.appService.updateApp({ id: version.appId, latestVersion: version.id })

	// 		this.appClientsService.releaseUpdate(version)

	// 		return {
	// 			isSuccessful: true,
	// 		}
	// 	} catch (error) {
	// 		return {
	// 			isSuccessful: false,
	// 			errorMessage: error.message,
	// 		}
	// 	}
	// }
}
