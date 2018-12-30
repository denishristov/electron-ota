import { EventType, IAppModel, ICheckForUpdateRequest } from 'shared'
import { IPreRespondHook, ISocketMediator, IClients, IPostRespondHook } from './Interfaces'

import { IAdminsService } from '../services/AdminsService'
import { IAppService } from '../services/AppService'
import { IVersionService } from '../services/VersionService'
import { IFileUploadService } from '../services/S3Service'

import { ReleaseUpdateHookFactory as IReleaseUpdateHookFactory } from '../hooks/ReleaseUpdateHook'
import { IUpdateService } from '../services/UpdateService'

import SocketMediator from './Mediator'

export interface IMediatorFactory {
	createAdminMediator(): ISocketMediator
	createUpdateClientsMediator(adminMediator: ISocketMediator, app: IAppModel): ISocketMediator
}

export type UpdateClientsMediatorFactory = (app: IAppModel) => ISocketMediator

@DI.injectable()
export default class MediatorFactory implements IMediatorFactory {
	constructor(
		@DI.inject(DI.SocketServer) private readonly server: SocketIO.Server,
		@DI.inject(DI.Services.User) private readonly userService: IAdminsService,
		@DI.inject(DI.Services.App) private readonly appService: IAppService,
		@DI.inject(DI.Services.Version) private readonly versionService: IVersionService,
		@DI.inject(DI.Services.FileUpload) private readonly fileUploadService: IFileUploadService,
		@DI.inject(DI.Services.Update) private readonly updateService: IUpdateService,
		@DI.inject(DI.Hooks.Auth) private readonly authHook: IPreRespondHook,
		@DI.inject(DI.Hooks.UpdateClientsMediator) private readonly createClientsMediatorHook: IPostRespondHook,
		@DI.inject(DI.Factories.ReleaseUpdateHook) private readonly releaseUpdateHookFactory: IReleaseUpdateHookFactory,
	) {}

	public createAdminMediator() {
		const mediator = new SocketMediator(this.server.of('/admins'))

		mediator.use(
			[EventType.CreateApp, this.appService.createApp],
			[EventType.UpdateApp, this.appService.updateApp],
			[EventType.DeleteApp, this.appService.deleteApp],
			[EventType.GetApps, this.appService.getAllApps],
			[EventType.CreateVersion, this.versionService.createVersion],
			[EventType.UpdateVersion, this.versionService.updateVersion],
			[EventType.DeleteVersion, this.versionService.deleteVersion],
			[EventType.PublishVersion, this.versionService.publishVersion],
			[EventType.GetVersions, this.versionService.getVersions],
			[EventType.Login, this.userService.login],
			[EventType.Authentication, this.userService.authenticate],
			[EventType.SignUploadVersionUrl, this.fileUploadService.signVersionUploadUrl],
			[EventType.SignUploadPictureUrl, this.fileUploadService.signPictureUploadUrl],
		)

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
		const mediator = new SocketMediator(this.server.of(`/${app.bundleId}`))

		const releaseUpdateHook = this.releaseUpdateHookFactory(mediator)
		adminMediator.usePostRespond(releaseUpdateHook)

		mediator.use(
			[
				EventType.CheckForUpdate,
				(req: ICheckForUpdateRequest) => this.updateService.checkForUpdate(app, req),
			],
		)

		return mediator
	}
}
