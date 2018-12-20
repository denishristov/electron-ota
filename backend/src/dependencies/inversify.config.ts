import { Container } from 'inversify'

import { Handlers, Models, Services } from './symbols'

import { IAppService } from '../services/AppService'
import { IUserService } from '../services/UserService'
import { IVersionService } from '../services/VersionService'
import { IHandler } from '../util/mediator/Interfaces'

import AppService from '../services/AppService'
import S3Service, { IS3Service } from '../services/S3Service'
import UserService from '../services/UserService'
import VersionService from '../services/VersionService'

import UserAuthenticationHandler from '../handlers/user/UserAuthenticationHandler'
import UserLoginHandler from '../handlers/user/UserLoginHandler'

import CreateAppHandler from '../handlers/apps/CreateAppHandler'
import DeleteAppHandler from '../handlers/apps/DeleteAppHandler'
import GetAppsHandler from '../handlers/apps/GetAppsHandler'
import UpdateAppHandler from '../handlers/apps/UpdateAppHandler'

import SignUploadPictureHandler from '../handlers/s3/SignUploadPictureHandler'
import SignUploadVersionHandler from '../handlers/s3/SignUploadVersionHandler'
import CreateVersionHandler from '../handlers/version/CreateVersionHandler'
import DeleteVersionHandler from '../handlers/version/DeleteVersionHandler'
import GetVersionsHandler from '../handlers/version/GetVersionsHandler'
import UpdateVersionHandler from '../handlers/version/UpdateVersionHandler'

import { AppSchema, IAppDocument } from '../models/App'
import { IUserDocument, UserSchema } from '../models/User'
import { IVersionDocument, VersionSchema } from '../models/Version'

import { Model, model } from 'mongoose'

const container = new Container()

container.bind<IUserService>(Services.User)
	.to(UserService)
	.inSingletonScope()

container.bind<IAppService>(Services.App)
	.to(AppService)
	.inSingletonScope()

container.bind<IVersionService>(Services.Version)
	.to(VersionService)
	.inSingletonScope()

container.bind<IS3Service>(Services.S3)
	.to(S3Service)
	.inSingletonScope()

container.bind<Model<IUserDocument>>(Models.User)
	.toConstantValue(model<IUserDocument>('User', UserSchema))

container.bind<Model<IAppDocument>>(Models.App)
	.toConstantValue(model<IAppDocument>('App', AppSchema))

container.bind<Model<IVersionDocument>>(Models.Version)
	.toConstantValue(model<IVersionDocument>('Version', VersionSchema))

const handlers = {
	[Handlers.User.Login]: UserLoginHandler,
	[Handlers.User.Authentication]: UserAuthenticationHandler,
	[Handlers.App.Create]: CreateAppHandler,
	[Handlers.App.Update]: UpdateAppHandler,
	[Handlers.App.Delete]: DeleteAppHandler,
	[Handlers.App.Get]: GetAppsHandler,
	[Handlers.Version.Get]: GetVersionsHandler,
	[Handlers.Version.Update]: UpdateVersionHandler,
	[Handlers.Version.Delete]: DeleteVersionHandler,
	[Handlers.Version.Create]: CreateVersionHandler,
	[Handlers.S3.SignUploadVersion]: SignUploadVersionHandler,
	[Handlers.S3.SignUploadPicture]: SignUploadPictureHandler,
}

Object.getOwnPropertySymbols(handlers).forEach((key: keyof object) => {
	container.bind<IHandler>(key)
		.to(handlers[key])
		.inSingletonScope()
})

export default container
