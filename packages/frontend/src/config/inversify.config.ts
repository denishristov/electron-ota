import { Container } from 'inversify'
import getDecorators from 'inversify-inject-decorators'
import io from 'socket.io-client'

import { SERVER_URI } from '.'

import Api, { IApi } from '../services/Api'

import AppsStore, { IAppsStore } from '../stores/AppsStore'
import UserStore, { IUserStore } from '../stores/UserStore'

import FileService, { IFileService } from '../services/FileService'
import UploadService, { IUploadService } from '../services/UploadService'

import { createBrowserHistory } from 'history'
import { BrowserHistory } from '../util/types'

import appFactory, { AppFactory } from '../stores/factories/AppFactory'
import createVersionStoreFactory, { CreateVersionStoreFactory } from '../stores/factories/CreateVersionStoreFactory'
import updateVersionStoreFactory, { UpdateVersionStoreFactory } from '../stores/factories/UpdateVersionStoreFactory'
import { IAppModalStore } from '../stores/AppModalStore'
import CreateAppStore, { ICreateAppStore } from '../stores/CreateAppStore'
import { IUpdateAppStore } from '../stores/UpdateAppStore'
import UpdateAppStore from '../stores/UpdateAppStore'
import AppModalStore from '../stores/AppModalStore'
import VersionModalStore, { IVersionModalStore } from '../stores/VersionModalStore'

const container = new Container()

const { lazyInject } = getDecorators(container)
DI.lazyInject = lazyInject

container.bind(DI.Connection)
	.toConstantValue(io(SERVER_URI))

container.bind<BrowserHistory>(DI.BrowserHistory)
	.toDynamicValue(() => {
		const history = createBrowserHistory()
		const prevLocation = {
			pathname: '',
			hash: '',
		}

		history.listen((location) => {
			const pathChanged = prevLocation.pathname !== location.pathname
			const hashChanged = prevLocation.hash !== location.hash

			if (pathChanged || hashChanged) {
				window.scrollTo(0, 0)
			}

			prevLocation.pathname = location.pathname
			prevLocation.hash = location.hash
		})

		return history
	})
	.inSingletonScope()

container.bind<IApi>(DI.Services.Api)
	.to(Api)
	.inSingletonScope()

container.bind<IUserStore>(DI.Stores.User)
	.to(UserStore)
	.inSingletonScope()

container.bind<IAppsStore>(DI.Stores.Apps)
	.to(AppsStore)
	.inSingletonScope()

container.bind<IAppModalStore>(DI.Stores.AppModal)
	.to(AppModalStore)
	.inTransientScope()

container.bind<ICreateAppStore>(DI.Stores.CreateApp)
	.to(CreateAppStore)
	.inTransientScope()

container.bind<IUpdateAppStore>(DI.Stores.UpdateApp)
	.to(UpdateAppStore)
	.inTransientScope()

container.bind<IVersionModalStore>(DI.Stores.VersionModal)
	.to(VersionModalStore)
	.inTransientScope()

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
