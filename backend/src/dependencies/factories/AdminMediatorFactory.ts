import { EventType } from 'shared'
import { interfaces } from 'inversify'

import { IVersionService } from '../../services/VersionService'
import { IAppService } from '../../services/AppService'
import { IRegisterCredentialsService } from '../../services/RegisterAdminService'
import { IAdminsService } from '../../services/AdminsService'
import { IFileUploadService } from '../../services/S3Service'
import { IReleaseService } from '../../services/UpdateService'
import { IPreRespondHook, IPostRespondHook } from '../../util/mediator/Interfaces'
import { IVersionStatisticsService } from '../../services/VersionStatisticsService'
import SocketMediator from '../../util/mediator/Mediator'

const namespaceName = '/admins'

export default function adminMediatorFactory({ container }: interfaces.Context) {
	const server = container.get<SocketIO.Server>(DI.SocketServer)

	const adminService = container.get<IAdminsService>(DI.Services.Admin)
	const appService = container.get<IAppService>(DI.Services.App)
	const versionService = container.get<IVersionService>(DI.Services.Version)
	const fileUploadService = container.get<IFileUploadService>(DI.Services.FileUpload)
	const updateService = container.get<IReleaseService>(DI.Services.Update)
	const registerCredentialsService = container.get<IRegisterCredentialsService>(DI.Services.RegisterCredentials)
	const versionStatisticsService = container.get<IVersionStatisticsService>(DI.Services.VersionStatistics)

	const authHook = container.get<IPreRespondHook>(DI.Hooks.Auth)
	const createClientsMediatorHook = container.get<IPostRespondHook>(DI.Hooks.UpdateClientsMediator)

	const mediator = new SocketMediator(server.of(namespaceName))

	mediator.use({
		[EventType.Login]: adminService.login,
		[EventType.Authentication]: adminService.authenticate,
		[EventType.RegisterAdmin]: adminService.register,

		[EventType.GetRegisterKeyPath]: registerCredentialsService.getCredentialsKeyPath,

		[EventType.GetApps]: appService.getAllApps,
		[EventType.CreateApp]: appService.createApp,
		[EventType.UpdateApp]: appService.updateApp,
		[EventType.DeleteApp]: appService.deleteApp,

		[EventType.GetVersions]: versionService.getVersions,
		[EventType.CreateVersion]: versionService.createVersion,
		[EventType.UpdateVersion]: versionService.updateVersion,
		[EventType.DeleteVersion]: versionService.deleteVersion,

		[EventType.ReleaseUpdate]: updateService.releaseVersion,

		[EventType.SignUploadVersionUrl]: fileUploadService.signVersionUploadUrl,
		[EventType.SignUploadPictureUrl]: fileUploadService.signPictureUploadUrl,

		// [EventType.VersionSimpleReports]: versionStatisticsService.getVersionSimpleReports,
	})

	mediator.usePreRespond(authHook)

	mediator.usePostRespond(createClientsMediatorHook)

	mediator.broadcastEvents(
		EventType.CreateApp,
		EventType.UpdateApp,
		EventType.DeleteApp,
		EventType.CreateVersion,
		EventType.UpdateVersion,
		EventType.DeleteVersion,
		EventType.ReleaseUpdate,
	)

	return mediator
}
