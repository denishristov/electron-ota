import 'shared/dist/extensions'
import './config/global'
import './config/mongoose'

import 'reflect-metadata'
import container from './dependencies/inversify.config'

import { UpdateClientsMediatorFactory } from './dependencies/factories/UpdateClientsMediatorFactory'
import { AdminMediatorFactory } from './dependencies/factories/AdminMediatorFactory'
import { IAppService } from './services/AppService'

async function setup() {
	container.get<AdminMediatorFactory>(DI.Mediators.Admins)()

	const appService = container.get<IAppService>(DI.Services.App)
	const clientsMediatorFactory = container.get<UpdateClientsMediatorFactory>(DI.Factories.ClientsMediator)

	const { apps } = await appService.getAllApps()

	for (const app of apps) {
		clientsMediatorFactory(app)
	}
}

setup()
