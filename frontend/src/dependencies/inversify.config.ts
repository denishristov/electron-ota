import { Container } from 'inversify'
import getDecorators from 'inversify-inject-decorators'
import io from 'socket.io-client'

import { SERVER_URI } from '../config/config'

import Api, { IApi } from '../util/Api'

import AppsStore, { IAppsStore } from '../stores/AppsStore'
import UserStore, { IUserStore } from '../stores/UserStore'
import RegisterStore, { IRegisterStore } from '../stores/RegisterStore'
import appFactory, { AppFactory } from './factories/AppFactory'
import { createBrowserHistory } from 'history'
import { BrowserHistory } from '../util/types'

const container = new Container()

const { lazyInject } = getDecorators(container)
DI.lazyInject = lazyInject

container.bind(DI.Connection)
	.toConstantValue(io(SERVER_URI))

container.bind<IApi>(DI.Api)
	.to(Api)
	.inSingletonScope()

container.bind<IUserStore>(DI.Stores.User)
	.to(UserStore)
	.inSingletonScope()

container.bind<IAppsStore>(DI.Stores.Apps)
	.to(AppsStore)
	.inSingletonScope()

container.bind<IRegisterStore>(DI.Stores.Register)
	.to(RegisterStore)
	.inSingletonScope()

container.bind<AppFactory>(DI.Factories.App)
	.toFactory(appFactory)

container.bind<BrowserHistory>(DI.BrowserHistory)
	.toConstantValue(createBrowserHistory())

export default container
