import { Container } from "inversify"

import { Services, Handlers, Models } from "./symbols"

import { IUserService } from "../services/UserService"
import { IAppService } from "../services/AppService"
import { IVersionService } from "../services/VersionService"
import { IHandler } from "../util/mediator/Interfaces"

import UserService from "../services/UserService"
import AppService from "../services/AppService"
import VersionService from "../services/VersionService"
import S3Service, { IS3Service } from "../services/S3Service"

import UserAuthenticationHandler from "../handlers/user/UserAuthenticationHandler"
import UserLoginHandler from "../handlers/user/UserLoginHandler"

import CreateAppHandler from "../handlers/apps/CreateAppHandler"
import UpdateAppHandler from "../handlers/apps/UpdateAppHandler"
import GetAppsHandler from "../handlers/apps/GetAppsHandler"
import DeleteAppHandler from "../handlers/apps/DeleteAppHandler"

import GetVersionsHandler from "../handlers/version/GetVersionsHandler"
import DeleteVersionHandler from "../handlers/version/DeleteVersionHandler"
import CreateVersionHandler from "../handlers/version/CreateVersionHandler"
import UpdateVersionHandler from "../handlers/version/UpdateVersionHandler"
import SignUploadVersionHandler from "../handlers/s3/SignUploadVersionHandler"
import SignUploadPictureHandler from "../handlers/s3/SignUploadPictureHandler"

import { IUserDocument, UserSchema } from "../models/User"
import { IAppDocument, AppSchema } from "../models/App"
import { VersionSchema, IVersionDocument } from '../models/Version'

import { Model, model } from "mongoose"

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