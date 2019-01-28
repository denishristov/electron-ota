import 'shared/dist/extensions'
import './config/global'
import './config/mongoose'

import 'reflect-metadata'
import container from './dependencies/inversify.config'

import { ClientsMediatorFactory } from './dependencies/factories/ClientsMediatorFactory'
import { IAppService } from './services/AppService'
import { ISocketMediator } from './util/mediator/interfaces'

(async function setup() {
	container.get(DI.Mediators.Admins)

	const appService = container.get<IAppService>(DI.Services.App)
	const clientsMediatorFactory = container.get<ClientsMediatorFactory>(DI.Factories.ClientsMediator)
	const clientMediators = container.get<Map<string, ISocketMediator>>(DI.Mediators.Clients)

	const bundleIds = await appService.getAllBundleIds()

	for (const bundleId of bundleIds) {
		clientMediators.set(bundleId, clientsMediatorFactory(bundleId))
	}
}())
