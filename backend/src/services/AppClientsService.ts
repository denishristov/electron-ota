import { EventType, IAppModel, INewUpdateMessage, IVersionModel } from 'shared'
import { IHandler, IMediator } from '../util/mediator/Interfaces'
import MediatorBuilder from '../util/mediator/MediatorBuilder'
import AppUpdateService, { IAppUpdateService } from './AppUpdateService'
import { inject } from 'inversify'
import CheckForUpdateHandler from '../handlers/update/CheckForUpdateHandler'
import { Services } from '../dependencies/symbols'
import { IVersionService } from './VersionService'
import { IAppService } from './AppService'

export interface IAppClientService {
	releaseUpdate(version: INewUpdateMessage): void
}

export default class AppClientsService  {
	// private readonly namespace: SocketIO.Namespace
	// private readonly appUpdateService: IAppUpdateService
	// private readonly clientsMediator: IMediator

	// constructor(
	// 	app: IAppModel,
	// 	server: SocketIO.Server,
	// 	@inject(Services.Version) versionService: IVersionService,
	// 	@inject(Services.App) appService: IAppService,
	// ) {

	// }

	// public releaseUpdate(version: IVersionModel) {
	// 	const {
	// 		isBase,
	// 		isCritical,
	// 		downloadUrl,
	// 		description,
	// 	} = version

	// 	const update = {
	// 		isBase,
	// 		isCritical,
	// 		downloadUrl,
	// 		description,
	// 	}

	// 	this.clientsMediator.emit(EventType.NewUpdate, update)
	// }
}
