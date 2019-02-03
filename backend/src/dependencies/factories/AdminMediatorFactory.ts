import {
	EventType,
	AdminLoginRequest,
	AdminLoginResponse,
	AdminAuthenticationRequest,
	AdminAuthenticationResponse,
	RegisterAdminRequest,
	GetAppsResponse,
	UpdateAppResponse,
	UpdateVersionRequest,
	CreateAppRequest,
	CreateAppResponse,
	UpdateAppRequest,
	DeleteAppRequest,
	DeleteAppResponse,
	GetVersionsResponse,
	DeleteVersionResponse,
	GetVersionsRequest,
	CreateVersionRequest,
	CreateVersionResponse,
	UpdateVersionResponse,
	DeleteVersionRequest,
	PublishVersionRequest,
	PublishVersionResponse,
	S3SignUrlRequest,
	S3SignUrlResponse,
	GetSimpleVersionReportsRequest,
	GetSimpleVersionReportsResponse,
	GetVersionReportsRequest,
	GetVersionReportsResponse,
	RegisterAdminResponse,
	RegisterKeyPathResponse,
} from 'shared'
import { interfaces } from 'inversify'

import { IVersionService } from '../../services/VersionService'
import { IAppService } from '../../services/AppService'
import { IRegisterCredentialsService } from '../../services/RegisterCredentialsService'
import { IAdminsService } from '../../services/AdminsService'
import { IFileUploadService } from '../../services/S3Service'
import { IReleaseService } from '../../services/ReleaseService'
import { IVersionReportsService } from '../../services/VersionReportsService'

import { IPreRespondHook, IPostRespondHook, ISocketMediator } from '../../util/mediator/interfaces'
import SocketMediator from '../../util/mediator/Mediator'
import { Empty } from '../../util/util'

const namespaceName = '/admins'

export default function adminMediatorFactory({ container }: interfaces.Context): ISocketMediator {
	const server = container.get<SocketIO.Server>(DI.SocketServer)

	const adminService = container.get<IAdminsService>(DI.Services.Admin)
	const appService = container.get<IAppService>(DI.Services.App)
	const versionService = container.get<IVersionService>(DI.Services.Version)
	const fileUploadService = container.get<IFileUploadService>(DI.Services.FileUpload)
	const updateService = container.get<IReleaseService>(DI.Services.Update)
	const registerCredentialsService = container.get<IRegisterCredentialsService>(DI.Services.RegisterCredentials)
	const versionReportsService = container.get<IVersionReportsService>(DI.Services.VersionReports)

	const authHook = container.get<IPreRespondHook>(DI.Hooks.Auth)
	const createClientsMediatorHook = container.get<IPostRespondHook>(DI.Hooks.CreateClientsMediator)
	const releaseUpdateHook = container.get<IPostRespondHook>(DI.Hooks.ReleaseUpdate)

	return new SocketMediator(server.of(namespaceName))
		.use(
			EventType.Login,
			adminService.login,
			AdminLoginRequest,
			AdminLoginResponse,
		)
		.use(
			EventType.Authentication,
			adminService.authenticate,
			AdminAuthenticationRequest,
			AdminAuthenticationResponse,
		)
		.use(
			EventType.RegisterAdmin,
			adminService.register,
			RegisterAdminRequest,
			RegisterAdminResponse,
		)
		.use(
			EventType.GetRegisterKeyPath,
			registerCredentialsService.getCredentialsKeyPath,
			Empty,
			RegisterKeyPathResponse,
		)
		.use(
			EventType.GetApps,
			appService.getAllApps,
			Empty,
			GetAppsResponse,
		)
		.use(
			EventType.CreateApp,
			appService.createApp,
			CreateAppRequest,
			CreateAppResponse,
		)
		.use(
			EventType.UpdateApp,
			appService.updateApp,
			UpdateAppRequest,
			UpdateAppResponse,
		)
		.use(
			EventType.DeleteApp,
			appService.deleteApp,
			DeleteAppRequest,
			DeleteAppResponse,
		)
		.use(
			EventType.GetVersions,
			versionService.getVersions,
			GetVersionsRequest,
			GetVersionsResponse,
		)
		.use(
			EventType.CreateVersion,
			versionService.createVersion,
			CreateVersionRequest,
			CreateVersionResponse,
		)
		.use(
			EventType.UpdateVersion,
			versionService.updateVersion,
			UpdateVersionRequest,
			UpdateVersionResponse,
		)
		.use(
			EventType.DeleteVersion,
			versionService.deleteVersion,
			DeleteVersionRequest,
			DeleteVersionResponse,
		)
		.use(
			EventType.ReleaseUpdate,
			updateService.releaseVersion,
			PublishVersionRequest,
			PublishVersionResponse,
		)
		.use(
			EventType.SignUploadVersionUrl,
			fileUploadService.signVersionUploadUrl,
			S3SignUrlRequest,
			S3SignUrlResponse,
		)
		.use(
			EventType.SignUploadPictureUrl,
			fileUploadService.signPictureUploadUrl,
			S3SignUrlRequest,
			S3SignUrlResponse,
		)
		.use(
			EventType.SimpleVersionReports,
			versionReportsService.getSimpleVersionReports,
			GetSimpleVersionReportsRequest,
			GetSimpleVersionReportsResponse,
		)
		.use(
			EventType.VersionReports,
			versionReportsService.getVersionReports,
			GetVersionReportsRequest,
			GetVersionReportsResponse,
		)
		.usePreRespond(authHook)
		.usePostRespond(
			createClientsMediatorHook,
			releaseUpdateHook,
		)
		.broadcastEvents(
			EventType.CreateApp,
			EventType.UpdateApp,
			EventType.DeleteApp,
			EventType.CreateVersion,
			EventType.UpdateVersion,
			EventType.DeleteVersion,
			EventType.ReleaseUpdate,
		)
}
