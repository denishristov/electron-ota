import { Container } from 'inversify'

import AppService, { IAppService } from '../services/AppService'
import UpdateService, { IUpdateService, UpdateServiceFactory } from '../services/UpdateService'
import AdminsService, { IAdminsService } from '../services/AdminsService'
import VersionService, { IVersionService } from '../services/VersionService'
import S3Service, { IFileUploadService } from '../services/S3Service'

import { Model, model as createModel } from 'mongoose'
import { IAppDocument, AppSchema } from '../models/App'
import { IUserDocument, UserSchema } from '../models/User'
import { IVersionDocument, VersionSchema } from '../models/Version'

import { IPreRespondHook, ISocketMediator, IPostRespondHook } from '../mediator/Interfaces'

import AuthHook from '../hooks/AuthHook'
import ReleaseUpdateHook, { ReleaseUpdateHookFactory } from '../hooks/ReleaseUpdateHook'
import CreateUpdateClientsMediator from '../hooks/CreateUpdateClientsMediator'

import MediatorFactory, { IMediatorFactory, UpdateClientsMediatorFactory } from '../mediator/MediatorFactory'
import { IAppModel } from 'shared'

import http from 'http'
import socketio from 'socket.io'

import s3Config from '../config/s3Config.json'

const container = new Container()

container.bind<http.Server>(DI.HTTPServer)
	.toConstantValue(http.createServer())

container.bind<SocketIO.Server>(DI.SocketServer)
	.toDynamicValue((context) => {
		// tslint:disable-next-line:no-console
		console.log('tumor')
		return socketio(context.container.get<http.Server>(DI.HTTPServer))
	})

container.bind<IAdminsService>(DI.Services.User)
	.to(AdminsService)
	.inSingletonScope()

container.bind<IAppService>(DI.Services.App)
	.to(AppService)
	.inSingletonScope()

container.bind<IVersionService>(DI.Services.Version)
	.to(VersionService)
	.inSingletonScope()

container.bind<IFileUploadService>(DI.Services.FileUpload)
	.toConstantValue(new S3Service(s3Config))

container.bind<IUpdateService>(DI.Services.Update)
	.to(UpdateService)
	.inSingletonScope()

container.bind<Model<IUserDocument>>(DI.Models.User)
	.toConstantValue(createModel<IUserDocument>('User', UserSchema))

container.bind<Model<IAppDocument>>(DI.Models.App)
	.toConstantValue(createModel<IAppDocument>('App', AppSchema))

container.bind<Model<IVersionDocument>>(DI.Models.Version)
	.toConstantValue(createModel<IVersionDocument>('Version', VersionSchema))

container.bind<IPreRespondHook>(DI.Hooks.Auth)
	.to(AuthHook)
	.inSingletonScope()

container.bind<IPostRespondHook>(DI.Hooks.UpdateClientsMediator)
	.to(CreateUpdateClientsMediator)
	.inSingletonScope()

container.bind<ReleaseUpdateHookFactory>(DI.Factories.ReleaseUpdateHook)
	.toFactory<ReleaseUpdateHook>((context) => {
		return (clientsMediator: ISocketMediator) => {
			const versionsService = context.container.get<IVersionService>(DI.Services.Version)
			return new ReleaseUpdateHook(clientsMediator, versionsService)
		}
	})

container.bind<IMediatorFactory>(DI.Factories.Mediator)
	.to(MediatorFactory)
	.inSingletonScope()

container.bind<ISocketMediator>(DI.Mediators.Admins)
	.toDynamicValue(({ container }) => {
		return container.get<IMediatorFactory>(DI.Factories.Mediator).createAdminMediator()
	})

container.bind<UpdateClientsMediatorFactory>(DI.Factories.ClientsMediator)
	.toFactory(({ container }) => {
		return (app: IAppModel) => {
			const adminsMediator = container.get<ISocketMediator>(DI.Mediators.Admins)
			return container.get<IMediatorFactory>(DI.Factories.Mediator)
				.createUpdateClientsMediator(adminsMediator, app)
		}
	})

export default container
