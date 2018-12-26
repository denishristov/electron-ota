import { Container } from 'inversify'

import AppService, { IAppService } from '../services/AppService'
import AppUpdateService, { IAppUpdateService } from '../services/AppUpdateService'
import UserService, { IUserService } from '../services/UserService'
import VersionService, { IVersionService } from '../services/VersionService'
import S3Service, { IS3Service } from '../services/S3Service'

import { Model, model as createModel } from 'mongoose'
import { IAppDocument, AppSchema } from '../models/App'
import { IUserDocument, UserSchema } from '../models/User'
import { IVersionDocument, VersionSchema } from '../models/Version'

import { IPreRespondHook } from '../mediator/Interfaces'
import AuthHook from '../hooks/AuthHook'

import MediatorFactory, { IMediatorFactory } from '../mediator/MediatorFactory'

const container = new Container()

container.bind<IUserService>(DI.Services.User)
	.to(UserService)
	.inSingletonScope()

container.bind<IAppService>(DI.Services.App)
	.to(AppService)
	.inSingletonScope()

container.bind<IVersionService>(DI.Services.Version)
	.to(VersionService)
	.inSingletonScope()

container.bind<IS3Service>(DI.Services.S3)
	.to(S3Service)
	.inSingletonScope()

container.bind<IAppUpdateService>(DI.Services.AppUpdate)
	.to(AppUpdateService)
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

container.bind<IMediatorFactory>(DI.Factories.Mediator)
	.to(MediatorFactory)
	.inSingletonScope()

export default container
