import { Container } from 'inversify'
import io from 'socket.io-client'

import { SERVER_URI } from '../config/config'

import Api, { IApi } from '../util/Api'

import AppsStore, { IAppsStore } from '../stores/AppsStore'
import RootStore, { IRootStore } from '../stores/RootStore'
import UserStore, { IUserStore } from '../stores/UserStore'
import RegisterStore, { IRegisterStore } from '../stores/RegisterStore'

const container = new Container()

container.bind(DI.Connection).toConstantValue(io(SERVER_URI))
container.bind<IApi>(DI.Api).to(Api).inSingletonScope()

container.bind<IUserStore>(DI.Stores.User).to(UserStore).inSingletonScope()
container.bind<IAppsStore>(DI.Stores.Apps).to(AppsStore).inSingletonScope()
container.bind<IRootStore>(DI.Stores.Root).to(RootStore).inSingletonScope()
container.bind<IRegisterStore>(DI.Stores.Register).to(RegisterStore).inSingletonScope()

export default container
