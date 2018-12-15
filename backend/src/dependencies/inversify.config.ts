import { Container } from "inversify"

import { SERVICES } from "./symbols"

import { IUserService } from "../services/UserService"
import { IAppService } from "../services/AppService"
import { IVersionService } from "../services/VersionService"

import UserService from "../services/UserService"
import AppService from "../services/AppService"
import VersionService from "../services/VersionService"

const container = new Container()

container.bind<IUserService>(SERVICES.USER).to(UserService).inSingletonScope()
container.bind<IAppService>(SERVICES.APP).to(AppService).inSingletonScope()
container.bind<IVersionService>(SERVICES.VERSION).to(VersionService).inSingletonScope()

export default container