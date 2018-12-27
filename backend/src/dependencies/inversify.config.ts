import { Container } from 'inversify'

import AppService, { IAppService } from '../services/AppService'
import UpdateService, { IUpdateService, UpdateServiceFactory } from '../services/UpdateService'
import AdminsService, { IAdminsService } from '../services/AdminsService'
import VersionService, { IVersionService } from '../services/VersionService'
import S3Service, { IS3Service } from '../services/S3Service'

import { Model, model as createModel } from 'mongoose'
import { IAppDocument, AppSchema } from '../models/App'
import { IUserDocument, UserSchema } from '../models/User'
import { IVersionDocument, VersionSchema } from '../models/Version'

import { IPreRespondHook, IMediator } from '../mediator/Interfaces'
import AuthHook from '../hooks/AuthHook'
import ReleaseUpdateHook, { ReleaseUpdateHookFactory } from '../hooks/ReleaseUpdateHook'

import MediatorFactory, { IMediatorFactory } from '../mediator/MediatorFactory'
import { IAppModel } from 'shared'

import s3Config from '../config/s3Config.json'

const container = new Container()

container.bind<IAdminsService>(DI.Services.User)
	.to(AdminsService)
	.inSingletonScope()

container.bind<IAppService>(DI.Services.App)
	.to(AppService)
	.inSingletonScope()

container.bind<IVersionService>(DI.Services.Version)
	.to(VersionService)
	.inSingletonScope()

container.bind<IS3Service>(DI.Services.S3)
	.toConstantValue(new S3Service(s3Config))

container.bind<UpdateServiceFactory>(DI.Factories.UpdateService)
	.toFactory<IUpdateService>((context) => {
		return (app: IAppModel) => {
			const versionsService = context.container.get<IVersionService>(DI.Services.Version)
			return new UpdateService(versionsService, app)
	}
})

container.bind<Model<IUserDocument>>(DI.Models.User)
	.toConstantValue(createModel<IUserDocument>('User', UserSchema))

container.bind<Model<IAppDocument>>(DI.Models.App)
	.toConstantValue(createModel<IAppDocument>('App', AppSchema))

container.bind<Model<IVersionDocument>>(DI.Models.Version)
	.toConstantValue(createModel<IVersionDocument>('Version', VersionSchema))

container.bind<IPreRespondHook>(DI.Hooks.Auth)
	.to(AuthHook)
	.inSingletonScope()

container.bind<ReleaseUpdateHookFactory>(DI.Factories.ReleaseUpdateHook)
	.toFactory<ReleaseUpdateHook>((context) => {
		return (clientsMediator: IMediator) => {
			const versionsService = context.container.get<IVersionService>(DI.Services.Version)
			return new ReleaseUpdateHook(clientsMediator, versionsService)
	}
})

container.bind<IMediatorFactory>(DI.Factories.Mediator)
	.to(MediatorFactory)
	.inSingletonScope()

export default container
