import { Container } from 'inversify'
import getDecorators from 'inversify-inject-decorators'

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

Object.defineProperty(window, 'lazyInject', {
	value: lazyInject,
})

container.bind<BrowserHistory>(nameof<BrowserHistory>())
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

container.bind<IApi>(nameof<IApi>())
	.to(Api)
	.inSingletonScope()

container.bind<IUserStore>(nameof<IUserStore>())
	.to(UserStore)
	.inSingletonScope()

container.bind<IAppsStore>(nameof<IAppsStore>())
	.to(AppsStore)
	.inSingletonScope()

container.bind<IAppModalStore>(nameof<IAppModalStore>())
	.to(AppModalStore)
	.inTransientScope()

container.bind<ICreateAppStore>(nameof<ICreateAppStore>())
	.to(CreateAppStore)
	.inTransientScope()

container.bind<IUpdateAppStore>(nameof<IUpdateAppStore>())
	.to(UpdateAppStore)
	.inTransientScope()

container.bind<IVersionModalStore>(nameof<IVersionModalStore>())
	.to(VersionModalStore)
	.inTransientScope()

container.bind<IFileService>(nameof<IFileService>())
	.to(FileService)
	.inSingletonScope()

container.bind<IUploadService>(nameof<IUploadService>())
	.to(UploadService)
	.inSingletonScope()

container.bind<AppFactory>(nameof<AppFactory>())
	.toFactory(appFactory)

container.bind<CreateVersionStoreFactory>(nameof<CreateVersionStoreFactory>())
	.toFactory(createVersionStoreFactory)

container.bind<UpdateVersionStoreFactory>(nameof<UpdateVersionStoreFactory>())
	.toFactory(updateVersionStoreFactory)

export default container
