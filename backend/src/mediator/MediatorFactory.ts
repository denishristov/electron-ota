import { EventType, IAppModel } from 'shared'
import { IPreRespondHook, IMediator } from './Interfaces'

import { IAdminsService } from '../services/AdminsService'
import { IAppService } from '../services/AppService'
import { IVersionService } from '../services/VersionService'
import { IS3Service } from '../services/S3Service'

import { ReleaseUpdateHookFactory as IReleaseUpdateHookFactory } from '../hooks/ReleaseUpdateHook'
import { UpdateServiceFactory as IUpdateServiceFactory } from '../services/UpdateService'

import Mediator from './Mediator'

export interface IMediatorFactory {
	createAdminMediator(namespace: SocketIO.Namespace): IMediator
	createAppClientsMediator(namespace: SocketIO.Namespace, adminMediator: IMediator, app: IAppModel): IMediator
}

@DI.injectable()
export default class MediatorFactory implements IMediatorFactory {
	constructor(
		@DI.inject(DI.Services.User) private readonly userService: IAdminsService,
		@DI.inject(DI.Services.App) private readonly appService: IAppService,
		@DI.inject(DI.Services.Version) private readonly versionService: IVersionService,
		@DI.inject(DI.Services.S3) private readonly s3Service: IS3Service,
		@DI.inject(DI.Hooks.Auth) private readonly authHook: IPreRespondHook,
		@DI.inject(DI.Factories.UpdateService) private readonly updateServiceFactory: IUpdateServiceFactory,
		@DI.inject(DI.Factories.ReleaseUpdateHook) private readonly releaseUpdateHookFactory: IReleaseUpdateHookFactory,
	) {}

	public createAdminMediator(namespace: SocketIO.Namespace) {
		const mediator = new Mediator()

		mediator.use(
			[EventType.CreateApp, this.appService.createApp],
			[EventType.UpdateApp, this.appService.updateApp],
			[EventType.DeleteApp, this.appService.deleteApp],
			[EventType.GetApps, this.appService.getApps],
			[EventType.CreateVersion, this.versionService.createVersion],
			[EventType.UpdateVersion, this.versionService.updateVersion],
			[EventType.DeleteVersion, this.versionService.deleteVersion],
			[EventType.PublishVersion, this.versionService.publishVersion],
			[EventType.GetVersions, this.versionService.getVersions],
			[EventType.Login, this.userService.login],
			[EventType.Authentication, this.userService.authenticate],
			[EventType.SignUploadVersionUrl, this.s3Service.signVersionUploadUrl],
			[EventType.SignUploadPictureUrl, this.s3Service.signPictureUploadUrl],
		)

		mediator.usePreRespond(this.authHook)

		mediator.broadcastEvents(
			EventType.CreateApp,
			EventType.UpdateApp,
			EventType.DeleteApp,
			EventType.CreateVersion,
			EventType.UpdateVersion,
			EventType.DeleteVersion,
			EventType.PublishVersion,
		)

		namespace.on(EventType.Connection, (client) => {
			mediator.subscribe(client)

			client.on(EventType.Disconnect, () => {
				mediator.unsubscribe(client)
			})
		})

		return mediator
	}

	public createAppClientsMediator(namespace: SocketIO.Namespace, adminMediator: IMediator, app: IAppModel) {
		const mediator = new Mediator()

		const appUpdateService = this.updateServiceFactory(app)

		const releaseUpdateHook = this.releaseUpdateHookFactory(mediator)
		adminMediator.usePostRespond(releaseUpdateHook)

		mediator.use(
			[EventType.CheckForUpdate, appUpdateService.checkForUpdate],
		)

		namespace.on(EventType.Connection, (client) => {
			mediator.subscribe(client)

			client.on(EventType.Disconnect, () => {
				mediator.unsubscribe(client)
			})
		})

		return mediator
	}
}
