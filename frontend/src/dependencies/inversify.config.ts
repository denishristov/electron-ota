import { Container } from 'inversify'
import io from 'socket.io-client'
import * as DI from './symbols'

import AppsStore, { IAppsStore } from '../stores/AppsStore'
import RootStore, { IRootStore } from '../stores/RootStore'
import UserStore, { IUserStore } from '../stores/UserStore'
import Api, { IApi } from '../util/Api'

const container = new Container()
const url = 'http://localhost:4000/admins'

container.bind(DI.Connection).toConstantValue(io(url))
container.bind<IApi>(DI.Api).to(Api).inSingletonScope()

container.bind<IUserStore>(DI.Stores.User).to(UserStore).inSingletonScope()
container.bind<IAppsStore>(DI.Stores.Apps).to(AppsStore).inSingletonScope()
container.bind<IRootStore>(DI.Stores.Root).to(RootStore).inSingletonScope()

export default container
