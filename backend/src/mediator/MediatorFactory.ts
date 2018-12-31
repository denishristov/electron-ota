import { EventType, IAppModel } from 'shared'
import { IPreRespondHook, ISocketMediator, IPostRespondHook } from './Interfaces'

import { IAdminsService } from '../services/AdminsService'
import { IAppService } from '../services/AppService'
import { IVersionService } from '../services/VersionService'
import { IFileUploadService } from '../services/S3Service'

import { ReleaseUpdateHookFactory } from '../hooks/ReleaseUpdateHook'
import { UpdateServiceFactory } from '../services/UpdateService'

import SocketMediator from './Mediator'

export interface IMediatorFactory {
	createAdminMediator(): ISocketMediator
	createUpdateClientsMediator(adminMediator: ISocketMediator, app: IAppModel): ISocketMediator
}

@DI.injectable()
export default class MediatorFactory implements IMediatorFactory {
	constructor(
		@DI.inject(DI.SocketServer)
		private readonly server: SocketIO.Server,
		@DI.inject(DI.Services.User)
		private readonly adminService: IAdminsService,
		@DI.inject(DI.Services.App)
		private readonly appService: IAppService,
		@DI.inject(DI.Services.Version)
		private readonly versionService: IVersionService,
		@DI.inject(DI.Services.FileUpload)
		private readonly fileUploadService: IFileUploadService,
		@DI.inject(DI.Hooks.Auth)
		private readonly authHook: IPreRespondHook,
		@DI.inject(DI.Hooks.UpdateClientsMediator)
		private readonly createClientsMediatorHook: IPostRespondHook,
		@DI.inject(DI.Factories.UpdateService)
		private readonly updateServiceFactory: UpdateServiceFactory,
		@DI.inject(DI.Factories.ReleaseUpdateHook)
		private readonly releaseUpdateHookFactory: ReleaseUpdateHookFactory,
	) {}

	public createAdminMediator() {
		const namespaceName = '/admins'
		const mediator = new SocketMediator(this.server.of(namespaceName))

		mediator.use({
			[EventType.Login]: this.adminService.login,
			[EventType.Authentication]: this.adminService.authenticate,

			[EventType.Register]: this.adminService.register,
			[EventType.RegisterKeyAuth]: this.adminService.verifyCredentialKey,
			[EventType.RegisterKeyPath]: this.adminService.getCredentialsKeyPath,

			[EventType.GetApps]: this.appService.getAllApps,
			[EventType.CreateApp]: this.appService.createApp,
			[EventType.UpdateApp]: this.appService.updateApp,
			[EventType.DeleteApp]: this.appService.deleteApp,

			[EventType.GetVersions]: this.versionService.getVersions,
			[EventType.CreateVersion]: this.versionService.createVersion,
			[EventType.UpdateVersion]: this.versionService.updateVersion,
			[EventType.DeleteVersion]: this.versionService.deleteVersion,
			[EventType.PublishVersion]: this.versionService.publishVersion,

			[EventType.SignUploadVersionUrl]: this.fileUploadService.signVersionUploadUrl,
			[EventType.SignUploadPictureUrl]: this.fileUploadService.signPictureUploadUrl,
		})

		mediator.usePreRespond(this.authHook)

		mediator.usePostRespond(this.createClientsMediatorHook)

		mediator.broadcastEvents(
			EventType.CreateApp,
			EventType.UpdateApp,
			EventType.DeleteApp,
			EventType.CreateVersion,
			EventType.UpdateVersion,
			EventType.DeleteVersion,
			EventType.PublishVersion,
		)

		return mediator
	}

	public createUpdateClientsMediator(adminMediator: ISocketMediator, app: IAppModel) {
		const namespaceName = `/${app.bundleId}`
		const mediator = new SocketMediator(this.server.of(namespaceName))

		const updateService = this.updateServiceFactory(app)
		const releaseUpdateHook = this.releaseUpdateHookFactory(mediator)

		adminMediator.usePostRespond(releaseUpdateHook)

		mediator.use({
			[EventType.CheckForUpdate]: updateService.checkForUpdate,
		})

		return mediator
	}
}

export type UpdateClientsMediatorFactory = (app: IAppModel) => ISocketMediator
