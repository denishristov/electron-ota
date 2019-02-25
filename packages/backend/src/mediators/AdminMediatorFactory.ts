import { interfaces } from 'inversify'

import { IVersionService } from '../services/VersionService'
import { IAppService } from '../services/AppService'
import { IAdminsService } from '../services/AdminsService'
import { IFileUploadService } from '../services/S3Service'
import { IReleaseService } from '../services/ReleaseService'
import { IVersionReportsService } from '../services/VersionReportsService'
import { IClientCounterService } from '../services/ClientCounterService'

import { IAuthHook } from '../hooks/AuthHook'
import { IValidationHook } from '../hooks/ValidationHook'
import { IClientMediatorManagerHook } from '../hooks/ClientMediatorManagerHook'
import { IReleaseUpdateHook } from '../hooks/ReleaseUpdateHook'

import { ISocketMediator } from '../util/mediator/interfaces'
import SocketMediator from '../util/mediator/SocketMediator'

import {
	EventType,
	AuthenticatedRequest,
	AdminLoginRequest,
	AdminLoginResponse,
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
	SignUploadUrlRequest,
	SignUploadUrlResponse,
	GetSimpleVersionReportsRequest,
	GetSimpleVersionReportsResponse,
	GetVersionReportsRequest,
	GetVersionReportsResponse,
	RegisterAdminResponse,
	AdminEditProfileRequest,
	AdminPublicModel,
	GetAppCountersRequest,
	GetAppUsingReportsRequest,
	GetAppUsingReportsResponse,
	GetVersionGroupedReportsRequest,
	GetVersionGroupedReportsResponse,
} from 'shared'

export type AdminMediatorFactory = () => ISocketMediator

export default function adminMediatorFactory({ container }: interfaces.Context): AdminMediatorFactory {
	const server = container.get<SocketIO.Server>(DI.Server)

	const adminService = container.get<IAdminsService>(DI.Services.Admin)
	const appService = container.get<IAppService>(DI.Services.App)
	const versionService = container.get<IVersionService>(DI.Services.Version)
	const fileUploadService = container.get<IFileUploadService>(DI.Services.FileUpload)
	const updateService = container.get<IReleaseService>(DI.Services.Update)
	const versionReportsService = container.get<IVersionReportsService>(DI.Services.VersionReports)
	const clientCounterService = container.get<IClientCounterService>(DI.Services.ClientCounter)

	const authHook = container.get<IAuthHook>(DI.Hooks.Auth)
	const validationHook = container.get<IValidationHook>(DI.Hooks.Validation)
	const clientMediatorManagerHook = container.get<IClientMediatorManagerHook>(DI.Hooks.ClientMediatorManager)
	const releaseUpdateHook = container.get<IReleaseUpdateHook>(DI.Hooks.ReleaseUpdate)

	return () => new SocketMediator(server.of(DI.AdminMediator))
		.use({
			eventType: EventType.Login,
			handler: adminService.login,
			requestType: AdminLoginRequest,
			responseType: AdminLoginResponse,
		})
		.use({
			eventType: EventType.Logout,
			handler: adminService.logout,
			requestType: AuthenticatedRequest,
		})
		.use({
			eventType: EventType.Authentication,
			handler: adminService.authenticate,
			requestType: AuthenticatedRequest,
			responseType: AdminAuthenticationResponse,
		})
		.use({
			eventType: EventType.RegisterAdmin,
			handler: adminService.register,
			requestType: RegisterAdminRequest,
			responseType: RegisterAdminResponse,
		})
		.use({
			eventType: EventType.GetProfile,
			handler: adminService.getProfile,
			requestType: AuthenticatedRequest,
			responseType: AdminPublicModel,
		})
		.use({
			eventType: EventType.EditProfile,
			handler: adminService.editProfile,
			requestType: AdminEditProfileRequest,
		})
		.use({
			eventType: EventType.DeleteProfile,
			handler: adminService.deleteProfile,
			requestType: AuthenticatedRequest,
		})
		.use({
			eventType: EventType.GetApps,
			handler: appService.getAllApps,
			requestType: AuthenticatedRequest,
			responseType: GetAppsResponse,
		})
		.use({
			eventType: EventType.CreateApp,
			handler: appService.createApp,
			requestType: CreateAppRequest,
			responseType: CreateAppResponse,
			broadcast: true,
		})
		.use({
			eventType: EventType.UpdateApp,
			handler: appService.updateApp,
			requestType: UpdateAppRequest,
			responseType: UpdateAppResponse,
			broadcast: true,
		})
		.use({
			eventType: EventType.DeleteApp,
			handler: appService.deleteApp,
			requestType: DeleteAppRequest,
			responseType: DeleteAppResponse,
			broadcast: true,
		})
		.use({
			eventType: EventType.GetVersions,
			handler: appService.getAppVersions,
			requestType: GetVersionsRequest,
			responseType: GetVersionsResponse,
		})
		.use({
			eventType: EventType.CreateVersion,
			handler: versionService.createVersion,
			requestType: CreateVersionRequest,
			responseType: CreateVersionResponse,
			broadcast: true,
		})
		.use({
			eventType: EventType.UpdateVersion,
			handler: versionService.updateVersion,
			requestType: UpdateVersionRequest,
			responseType: UpdateVersionResponse,
			broadcast: true,
		})
		.use({
			eventType: EventType.DeleteVersion,
			handler: versionService.deleteVersion,
			requestType: DeleteVersionRequest,
			responseType: DeleteVersionResponse,
			broadcast: true,
		})
		.use({
			eventType: EventType.ReleaseUpdate,
			handler: updateService.releaseVersion,
			requestType: PublishVersionRequest,
			responseType: PublishVersionResponse,
			broadcast: true,
		})
		.use({
			eventType: EventType.SignUploadVersionUrl,
			handler: fileUploadService.signVersionUploadUrl,
			requestType: SignUploadUrlRequest,
			responseType: SignUploadUrlResponse,
		})
		.use({
			eventType: EventType.SignUploadPictureUrl,
			handler: fileUploadService.signPictureUploadUrl,
			requestType: SignUploadUrlRequest,
			responseType: SignUploadUrlResponse,
		})
		.use({
			eventType: EventType.SimpleVersionReports,
			handler: versionReportsService.getSimpleVersionReports,
			requestType: GetSimpleVersionReportsRequest,
			responseType: GetSimpleVersionReportsResponse,
		})
		.use({
			eventType: EventType.VersionReports,
			handler: versionReportsService.getVersionReports,
			requestType: GetVersionReportsRequest,
			responseType: GetVersionReportsResponse,
		})
		.use({
			eventType: EventType.AppsClientCount,
			handler: clientCounterService.getAppsClientsCount,
			requestType: AuthenticatedRequest,
		})
		.use({
			eventType: EventType.AppClientCount,
			handler: clientCounterService.getAppClientsCount,
			requestType: GetAppCountersRequest,
		})
		.use({
			eventType: EventType.AppUsingReports,
			handler: versionReportsService.getAppUsingReports,
			requestType: GetAppUsingReportsRequest,
			responseType: GetAppUsingReportsResponse,
		})
		.use({
			eventType: EventType.VersionGroupedReports,
			handler: versionReportsService.getVersionGroupedReports,
			requestType: GetVersionGroupedReportsRequest,
			responseType: GetVersionGroupedReportsResponse,
		})
		.pre(validationHook)
		.pre(authHook)
		.post(clientMediatorManagerHook)
		.post(releaseUpdateHook)
}
