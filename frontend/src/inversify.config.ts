import { Container } from 'inversify'

import { TYPES } from './util/types'

import AppsStore, { IAppsStore } from './stores/AppsStore'
import RootStore, { IRootStore } from './stores/RootStore'
import UserStore, { IUserStore } from './stores/UserStore'
import Api, { IApi } from './util/Api'

const container = new Container()

container.bind<IApi>(TYPES.Api).to(Api)
container.bind<IUserStore>(TYPES.UserStore).to(UserStore)
container.bind<IAppsStore>(TYPES.AppsStore).to(AppsStore)
container.bind<IRootStore>(TYPES.RootStore).to(RootStore)

export default container
