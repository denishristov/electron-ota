import { Container } from "inversify"

import { Services, Handlers } from "./symbols"

import { IUserService } from "../services/UserService"
import { IAppService } from "../services/AppService"
import { IVersionService } from "../services/VersionService"
import { IHandler } from "../util/mediator/Interfaces"

import UserService from "../services/UserService"
import AppService from "../services/AppService"
import VersionService from "../services/VersionService"

import UserAuthenticationHandler from "../handlers/user/UserAuthenticationHandler"
import UserLoginHandler from "../handlers/user/UserLoginHandler";

import CreateAppHandler from "../handlers/apps/CreateAppHandler";
import UpdateAppHandler from "../handlers/apps/UpdateAppHandler";
import GetAppsHandler from "../handlers/apps/GetAppsHandler";
import DeleteAppHandler from "../handlers/apps/DeleteAppHandler";

import GetVersionsHandler from "../handlers/version/GetVersionsHandler";
import DeleteVersionHandler from "../handlers/version/DeleteVersionHandler";
import CreateVersionHandler from "../handlers/version/CreateVersionHandler";
import UpdateVersionHandler from "../handlers/version/UpdateVersionHandler";

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
	

container.bind<IHandler>(Handlers.User.Login)
	.to(UserLoginHandler)
	.inSingletonScope()

container.bind<IHandler>(Handlers.User.Authentication)
	.to(UserAuthenticationHandler)
	.inSingletonScope()


container.bind<IHandler>(Handlers.App.Get)
	.to(GetAppsHandler)
	.inSingletonScope()

container.bind<IHandler>(Handlers.App.Update)
	.to(UpdateAppHandler)
	.inSingletonScope()

container.bind<IHandler>(Handlers.App.Create)
	.to(CreateAppHandler)
	.inSingletonScope()

container.bind<IHandler>(Handlers.App.Delete)
	.to(DeleteAppHandler)
	.inSingletonScope()


container.bind<IHandler>(Handlers.Version.Get)
	.to(GetVersionsHandler)
	.inSingletonScope()

container.bind<IHandler>(Handlers.Version.Update)
	.to(UpdateVersionHandler)
	.inSingletonScope()

container.bind<IHandler>(Handlers.Version.Create)
	.to(CreateVersionHandler)
	.inSingletonScope()

container.bind<IHandler>(Handlers.Version.Delete)
	.to(DeleteVersionHandler)
	.inSingletonScope()

export default container