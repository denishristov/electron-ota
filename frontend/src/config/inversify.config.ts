import { Container } from 'inversify'
import getDecorators from 'inversify-inject-decorators'
import io from 'socket.io-client'

import { SERVER_URI } from '.'

import Api, { IApi } from '../services/Api'

import AppsStore, { IAppsStore } from '../stores/AppsStore'
import UserStore, { IUserStore } from '../stores/UserStore'
import RegisterStore, { IRegisterStore } from '../stores/RegisterStore'

import FileService, { IFileService } from '../services/FileService'
import UploadService, { IUploadService } from '../services/UploadService'

import { createBrowserHistory } from 'history'
import { BrowserHistory } from '../util/types'

import appFactory, { AppFactory } from '../stores/factories/AppFactory'
import createVersionStoreFactory, { CreateVersionStoreFactory } from '../stores/factories/CreateVersionStoreFactory'
import updateVersionStoreFactory, { UpdateVersionStoreFactory } from '../stores/factories/UpdateVersionStoreFactory'

const container = new Container()

const { lazyInject } = getDecorators(container)
DI.lazyInject = lazyInject

container.bind(DI.Connection)
	.toConstantValue(io(SERVER_URI))

container.bind<IApi>(DI.Services.Api)
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

container.bind<BrowserHistory>(DI.BrowserHistory)
	.toConstantValue(createBrowserHistory())

container.bind<IFileService>(DI.Services.File)
	.to(FileService)
	.inSingletonScope()

container.bind<IUploadService>(DI.Services.Upload)
	.to(UploadService)
	.inSingletonScope()

container.bind<AppFactory>(DI.Factories.App)
	.toFactory(appFactory)

container.bind<CreateVersionStoreFactory>(DI.Factories.CreateVersionStore)
	.toFactory(createVersionStoreFactory)

container.bind<UpdateVersionStoreFactory>(DI.Factories.UpdateVersionStore)
	.toFactory(updateVersionStoreFactory)

export default container
